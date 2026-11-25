const fs = require('fs');
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');
const path = require('path');

const processFile = (filePath, fileType) => {
  try {
    let records = [];
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.csv') {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      records = parse(fileContent, {
        columns: true,        // Use first row as keys
        skip_empty_lines: true,
        trim: true,
      });
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Read first sheet
      const worksheet = workbook.Sheets[sheetName];
      records = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    }

    if (records.length === 0) {
      throw new Error('File is empty or has no valid data.');
    }

    // Extract metadata
    const columns = Object.keys(records[0]);
    const totalRows = records.length;
    const totalColumns = columns.length;
    
    // Save top 10 rows for preview
    const previewData = records.slice(0, 10);

    return { records, columns, totalRows, totalColumns, previewData };
  } catch (error) {
    throw new Error(`Error processing file: ${error.message}`);
  }
};

module.exports = { processFile };