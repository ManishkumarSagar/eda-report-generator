const Dataset = require('../models/Dataset');
const { runEDAAnalysis } = require('../services/edaService');

// @desc    Run EDA Analysis
// @route   POST /api/eda/:id/analyze
const analyzeDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    // Check ownership
    if (dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Run the EDA Engine
    const edaResults = runEDAAnalysis(dataset.records, dataset.columns);

    res.status(200).json(edaResults);
  } catch (error) {
    console.error('EDA Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get EDA Results (Same logic, frontend jab GET karega)
// @route   GET /api/eda/:id/results
const getEDAResults = async (req, res) => {
  // For now, we recalculate every time. In production, save these to MongoDB (Analysis model) and fetch.
  return analyzeDataset(req, res);
};

module.exports = { analyzeDataset, getEDAResults };