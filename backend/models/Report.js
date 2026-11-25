const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  reportName: { type: String, required: true },
  reportPath: { type: String, required: true },
  reportStatus: { type: String, default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);