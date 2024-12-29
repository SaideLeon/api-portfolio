// src/controllers/portfolioController.js
const { z } = require('zod');
const { portfolioService } = require('../services/portfolioService');

const portfolioController = {
  async getPublic(req, res) {
    try {
      const { userId } = req.params;
      const portfolio = await portfolioService.getPublicPortfolio(userId);
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAdmin(req, res) {
    try {
      const portfolio = await portfolioService.getPublicPortfolio(req.user.id);
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateInfo(req, res) {
    try {
      const schema = z.object({
        name: z.string().min(2),
        profession: z.string().optional(),
        bio: z.string().optional(),
        socialLinks: z.record(z.string().url()).optional()
      });

      const data = schema.parse(req.body);
      const portfolio = await portfolioService.updatePortfolioInfo(req.user.id, data);
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateDesign(req, res) {
    try {
      const schema = z.object({
        theme: z.string(),
        layout: z.string(),
        colors: z.record(z.string()),
        typography: z.record(z.string()),
        customCss: z.string().optional()
      });

      const data = schema.parse(req.body);
      const portfolio = await portfolioService.updatePortfolioDesign(req.user.id, data);
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateSEO(req, res) {
    try {
      const schema = z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        ogImage: z.string().url().optional(),
        customMetaTags: z.array(z.object({
          name: z.string(),
          content: z.string()
        })).optional()
      });

      const data = schema.parse(req.body);
      const portfolio = await portfolioService.updatePortfolioSEO(req.user.id, data);
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};






// src/controllers/analyticsController.js

module.exports = {
  portfolioController
};