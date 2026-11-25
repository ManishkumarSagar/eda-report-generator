const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  filePath: { type: String, required: true },
  totalRows: { type: Number, default: 0 },
  totalColumns: { type: Number, default: 0 },
  columns: { type: Array, default: [] },
  previewData: { type: Array, default: [] },
  records: { type: Array, default: [] } // <-- YEH ADD KAREIN (Raw data for EDA)
}, { timestamps: true });

module.exports = mongoose.model('Dataset', datasetSchema);