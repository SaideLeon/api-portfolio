// src/routes/tags.js
const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middlewares/auth');

router.post('/tags/recommendations', auth, tagController.getRecommendations);
router.post('/tags', auth, tagController.create);
router.put('/tags/:id/increment', auth, tagController.incrementUse);

module.exports = router;