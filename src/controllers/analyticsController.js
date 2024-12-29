const { z } = require('zod');
const analyticsService = require('../services/analyticsService');

const analyticsController = {
  async getVisitors(req, res) {
    try {
      const schema = z.object({
        startDate: z.string().transform(str => new Date(str)),
        endDate: z.string().transform(str => new Date(str))
      });

      const { startDate, endDate } = schema.parse(req.query);
      const stats = await analyticsService.getVisitorStats(req.user.id, startDate, endDate);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getPageviews(req, res) {
    try {
      const schema = z.object({
        startDate: z.string().transform(str => new Date(str)),
        endDate: z.string().transform(str => new Date(str)),
        page: z.string().optional()
      });

      const filters = schema.parse(req.query);
      const pageviews = await analyticsService.getPageviewStats(req.user.id, filters);
      res.json(pageviews);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
module.exports = {
  analyticsController
};