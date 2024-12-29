// src/routes/categories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');

router.post('/categories', auth, categoryController.create);
router.post('/categories/suggest', auth, categoryController.suggest);
router.put('/categories/:id/increment', auth, categoryController.incrementUse);

module.exports = router;