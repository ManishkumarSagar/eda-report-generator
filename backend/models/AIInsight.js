const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String, required: true },
  findings: { type: Array, default: [] },
  dataQuality: { type: Array, default: [] },
  recommendations: { type: Array, default: [] },
}, { timestamps: true });

module.exports = mongoose.model('AIInsight', aiInsightSchema);