const Dataset = require('../models/Dataset');
const { processFile } = require('../services/dataProcessor');
const fs = require('fs');

// @desc    Upload dataset
// @route   POST /api/datasets/upload
const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { path: filePath, originalname: fileName, mimetype: fileType, size: fileSize } = req.file;

    // YAHAN 'records' ko destructure karna zaruri tha
const { records, totalRows, totalColumns, columns, previewData } = processFile(filePath, fileType);

const dataset = await Dataset.create({
  userId: req.user._id,
  fileName,
  fileType,
  fileSize,
  filePath,
  totalRows,
  totalColumns,
  columns,
  previewData,
  records // Ab ye perfectly kaam karega
});

    res.status(201).json({
      message: 'File uploaded and processed successfully',
      datasetId: dataset._id,
      fileName: dataset.fileName,
      totalRows,
      totalColumns,
      previewData
    });

  } catch (error) {
    // Delete the uploaded file if processing failed
    if (req.file) fs.unlinkSync(req.file.path);
    
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all datasets for a user
// @route   GET /api/datasets
const getDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(datasets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single dataset by ID
// @route   GET /api/datasets/:id
const getDatasetById = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });
    
    // Check ownership
    if (dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.status(200).json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a dataset
// @route   DELETE /api/datasets/:id
const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Check ownership (User apna hi dataset delete kar sake)
    if (dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // File ko server se delete karein
    const fs = require('fs');
    if (dataset.filePath && fs.existsSync(dataset.filePath)) {
      fs.unlinkSync(dataset.filePath);
    }

    // Database se record delete karein
    await dataset.deleteOne();

    res.status(200).json({ message: 'Dataset removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadDataset, getDatasets, getDatasetById, deleteDataset };