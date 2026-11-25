const express = require('express');
const router = express.Router();
const { createInsights, getInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/:id/insights', createInsights);
router.get('/:id/insights', getInsights);

module.exports = router;