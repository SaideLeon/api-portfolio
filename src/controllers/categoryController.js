// src/controllers/categoryController.js
const { z } = require('zod');
const categoryService = require('../services/categoryService');

const categoryController = {
  async create(req, res) {
    try {
      const schema = z.object({
        name: z.string(),
        description: z.string().optional(),
        type: z.enum(['PROJECT', 'POST', 'PRODUCT', 'GENERAL']),
        parentId: z.string().optional(),
        keywords: z.array(z.object({
          word: z.string(),
          weight: z.number().min(0).max(10).optional()
        })).optional()
      });

      const data = schema.parse(req.body);
      const category = await categoryService.createCategory(req.user.id, data);
      
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async suggest(req, res) {
    try {
      const schema = z.object({
        content: z.string(),
        type: z.enum(['PROJECT', 'POST', 'PRODUCT', 'GENERAL']),
        limit: z.number().min(1).max(20).optional()
      });

      const { content, type, limit } = schema.parse(req.body);
      const suggestions = await categoryService.suggestCategories(content, type, req.user.id, limit);
      
      res.json(suggestions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async incrementUse(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryService.incrementCategoryUse(id);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = {
  categoryController
};