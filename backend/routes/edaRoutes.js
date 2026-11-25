const express = require('express');
const router = express.Router();
const { analyzeDataset, getEDAResults } = require('../controllers/edaController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/:id/analyze', analyzeDataset);
router.get('/:id/results', getEDAResults);

module.exports = router;