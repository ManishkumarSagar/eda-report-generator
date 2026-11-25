const ss = require('simple-statistics');

/**
 * Main EDA Engine Function
 * @param {Array} records - Raw data from dataProcessor (array of objects)
 * @param {Array} columns - Array of column names
 */
const runEDAAnalysis = (records, columns) => {
  const totalRows = records.length;
  const totalColumns = columns.length;

  let totalMissingValues = 0;
  let duplicateRows = 0;
  let outliersCount = 0;

  const missingValuesByColumn = {};
  const numericStats = [];
  const correlationMatrix = [];

  // 1. Identify Column Types & Missing Values
  const columnTypes = {};
  columns.forEach(col => {
    columnTypes[col] = { numericCount: 0, stringCount: 0, missing: 0 };
  });

  records.forEach(row => {
    columns.forEach(col => {
      const val = row[col];
      if (val === null || val === undefined || val === '') {
        columnTypes[col].missing++;
        totalMissingValues++;
      } else if (!isNaN(Number(val))) {
        columnTypes[col].numericCount++;
      } else {
        columnTypes[col].stringCount++;
      }
    });
  });

  // 2. Missing Values Summary for Frontend Chart
  columns.forEach(col => {
    missingValuesByColumn[col] = columnTypes[col].missing;
  });

  // 3. Duplicate Detection (Stringified row comparison)
  const seen = new Set();
  records.forEach(row => {
    const rowString = JSON.stringify(row);
    if (seen.has(rowString)) duplicateRows++;
    else seen.add(rowString);
  });

  // 4. Statistical Analysis & Outlier Detection (For Numeric Columns)
  columns.forEach(col => {
    // If column is mostly numeric
    if (columnTypes[col].numericCount > totalRows * 0.5) {
      // Extract valid numbers
      const numericData = records
        .map(r => Number(r[col]))
        .filter(n => !isNaN(n));

      if (numericData.length > 0) {
        // Basic Stats
        const mean = ss.mean(numericData);
        const median = ss.median(numericData);
        const min = ss.min(numericData);
        const max = ss.max(numericData);
        const stdDev = numericData.length > 1 ? ss.standardDeviation(numericData) : 0;

        // Outlier Detection (IQR Method - Chapter 12)
        let q1 = 0, q3 = 0, iqr = 0, outliers = 0;
        if (numericData.length >= 4) {
          q1 = ss.quantile(numericData, 0.25);
          q3 = ss.quantile(numericData, 0.75);
          iqr = q3 - q1;
          const lowerBound = q1 - 1.5 * iqr;
          const upperBound = q3 + 1.5 * iqr;
          
          outliers = numericData.filter(n => n < lowerBound || n > upperBound).length;
          outliersCount += outliers;
        }

        numericStats.push({
          column: col,
          mean: Number(mean.toFixed(2)),
          median: Number(median.toFixed(2)),
          min: Number(min.toFixed(2)),
          max: Number(max.toFixed(2)),
          stdDev: Number(stdDev.toFixed(2))
        });
      }
    }
  });

  // 5. Pearson Correlation Analysis (For top numeric columns)
  const numericColumns = numericStats.map(s => s.column);
  numericColumns.forEach((col1, i) => {
    numericColumns.forEach((col2, j) => {
      if (i < j) { // Calculate only once for pair
        const x = records.map(r => Number(r[col1])).filter(n => !isNaN(n));
        const y = records.map(r => Number(r[col2])).filter(n => !isNaN(n));
        
        // Need same length for correlation
        if (x.length === y.length && x.length > 1) {
          try {
            const corr = ss.sampleCorrelation(x, y);
            correlationMatrix.push({
              col1, col2, correlation: Number(corr.toFixed(2))
            });
          } catch (e) {
            // Ignore correlation errors (like zero variance)
          }
        }
      }
    });
  });

  // 6. Prepare Chart Data (Frontend ke hisaab se)
  // Chart 1: Missing Values by Column
  const missingChart = {
    labels: Object.keys(missingValuesByColumn).slice(0, 8), // max 8 columns
    data: Object.values(missingValuesByColumn).slice(0, 8)
  };

  // Chart 2: Distribution of first numeric column
  const firstNumericCol = numericColumns[0];
  let distributionChart = { labels: [], data: [] };
  
  if (firstNumericCol) {
    const values = records.map(r => Number(r[firstNumericCol])).filter(n => !isNaN(n));
    // Create a simple histogram with 6 bins
    if (values.length > 0) {
      const min = ss.min(values);
      const max = ss.max(values);
      const binSize = (max - min) / 6 || 1;
      
      const bins = [0, 0, 0, 0, 0, 0];
      const labels = [];
      
      for (let i = 0; i < 6; i++) {
        labels.push(`${(min + i * binSize).toFixed(0)} - ${(min + (i + 1) * binSize).toFixed(0)}`);
      }

      values.forEach(v => {
        let binIndex = Math.floor((v - min) / binSize);
        if (binIndex >= 6) binIndex = 5; // max out at last bin
        if (binIndex < 0) binIndex = 0;
        bins[binIndex]++;
      });

      distributionChart = { labels, data: bins };
    }
  }

  // Return final results formatted for frontend
  return {
    totalRows,
    totalColumns,
    missingValues: totalMissingValues,
    duplicateRows,
    outliersCount,
    missingValuesChart: missingChart,
    distributionChart: distributionChart,
    statistics: numericStats,
    correlations: correlationMatrix
  };
};

module.exports = { runEDAAnalysis };