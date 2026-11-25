const express= require("express");
const router= express.Router();
const { uploadDataset, getDatasets, getDatasetById, deleteDataset  }= require('../controllers/datasetController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
// All routes here are protected (require login)
router.use(protect);
router.post('/upload', upload.single('file'), uploadDataset);
router.get('/', getDatasets);
router.get('/:id', getDatasetById);
router.delete('/:id', deleteDataset);

module.exports= router;