const express = require('express');
const router = express.Router();
const { generateReport, getReports, downloadReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/:id/generate', generateReport);
router.get('/', getReports);
router.get('/:id/download', downloadReport);

module.exports = router;