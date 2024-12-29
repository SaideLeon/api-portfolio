// src/controllers/tagController.js
const { z } = require('zod');
const tagService = require('../services/tagService');

const tagController = {
  async getRecommendations(req, res) {
    try {
      const schema = z.object({
        content: z.string(),
        type: z.enum(['PROJECT', 'POST', 'PRODUCT', 'GENERAL']),
        limit: z.number().optional()
      });

      const { content, type, limit } = schema.parse(req.body);
      const recommendations = await tagService.getRecommendedTags(content, type, req.user.id, limit);
      
      res.json(recommendations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const schema = z.object({
        name: z.string(),
        type: z.enum(['PROJECT', 'POST', 'PRODUCT', 'GENERAL'])
      });

      const { name, type } = schema.parse(req.body);
      const tag = await tagService.createTag(req.user.id, name, type);
      
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async incrementUse(req, res) {
    try {
      const { id } = req.params;
      const tag = await tagService.incrementTagUse(id);
      res.json(tag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = tagController;
