const path = require('path');
const fs = require('fs');
const Dataset = require('../models/Dataset');
const Report = require('../models/Report');
const AIInsight = require('../models/AIInsight');
const { runEDAAnalysis } = require('../services/edaService');
const { generatePDFReport } = require('../services/reportService');

// Ensure reports folder exists
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// @desc    Generate PDF report
// @route   POST /api/reports/:id/generate
const generateReport = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    const edaResults = runEDAAnalysis(dataset.records, dataset.columns);
    const aiInsights = await AIInsight.findOne({ datasetId: dataset._id });

    const reportName = `${dataset.fileName.split('.')[0]}-Report-${Date.now()}.pdf`;
    const reportPath = path.join(reportsDir, reportName);

    await generatePDFReport(dataset, edaResults, aiInsights, reportPath);

    const report = await Report.create({
      userId: req.user._id,
      datasetId: dataset._id,
      reportName,
      reportPath,
    });

    res.status(201).json({ message: 'Report generated', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download report PDF
// @route   GET /api/reports/:id/download
const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!fs.existsSync(report.reportPath)) {
      return res.status(404).json({ message: 'PDF file not found on server' });
    }

    res.download(report.reportPath, report.reportName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateReport, getReports, downloadReport };