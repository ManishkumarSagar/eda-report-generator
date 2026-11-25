const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  results: { type: Object, required: true }, // Saare EDA results (stats, charts, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);