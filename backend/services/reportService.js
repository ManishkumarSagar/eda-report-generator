const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDFReport = async (dataset, edaResults, aiInsights, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);
      
      doc.pipe(stream);

      // --- Header ---
      doc.fontSize(24).fillColor('#c2410c').text('EDA Analysis Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).fillColor('#333').text(`Dataset: ${dataset.fileName}`, { align: 'center' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      // --- 1. Dataset Overview ---
      doc.fontSize(16).fillColor('#202124').text('1. Dataset Overview');
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor('#555');
      doc.text(`Total Rows: ${edaResults.totalRows}`);
      doc.text(`Total Columns: ${edaResults.totalColumns}`);
      doc.text(`Missing Values: ${edaResults.missingValues}`);
      doc.text(`Duplicate Rows: ${edaResults.duplicateRows}`);
      doc.moveDown();

      // --- 2. Statistics Summary ---
      doc.fontSize(16).fillColor('#202124').text('2. Statistical Summary');
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor('#555');
      edaResults.statistics.forEach(stat => {
        doc.text(`${stat.column} -> Mean: ${stat.mean}, Median: ${stat.median}, Min: ${stat.min}, Max: ${stat.max}`);
      });
      doc.moveDown();

      // --- 3. AI Insights ---
      if (aiInsights) {
        doc.fontSize(16).fillColor('#202124').text('3. AI-Generated Insights');
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor('#555');
        doc.text(`Summary: ${aiInsights.summary}`);
        doc.moveDown();
        doc.text('Recommendations:');
        aiInsights.recommendations.forEach(rec => {
          doc.text(`- ${rec}`);
        });
      }

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDFReport };