const Dataset = require('../models/Dataset');
const AIInsight = require('../models/AIInsight');
const { runEDAAnalysis } = require('../services/edaService');
const { generateInsights } = require('../services/aiService');

// @desc    Generate AI Insights using LLM
// @route   POST /api/ai/:id/insights
const createInsights = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    if (dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if insights already exist
    let insight = await AIInsight.findOne({ datasetId: dataset._id });
    if (insight) {
      return res.status(200).json(insight);
    }

    // Run EDA first to get stats
    const edaResults = runEDAAnalysis(dataset.records, dataset.columns);
    
    // Send to LLM
    const aiData = await generateInsights(edaResults);

    // Save to DB
    insight = await AIInsight.create({
      datasetId: dataset._id,
      userId: req.user._id,
      summary: aiData.summary,
      findings: aiData.findings,
      dataQuality: aiData.dataQuality,
      recommendations: aiData.recommendations,
    });

    res.status(201).json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI Insights
// @route   GET /api/ai/:id/insights
const getInsights = async (req, res) => {
  try {
    const insight = await AIInsight.findOne({ datasetId: req.params.id });
    if (!insight) return res.status(404).json({ message: 'Insights not found. Please generate them first.' });
    res.status(200).json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInsights, getInsights };