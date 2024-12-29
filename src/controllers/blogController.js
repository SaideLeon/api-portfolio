// src/controllers/blogController.js
const { z } = require('zod');
const { blogService } = require('../services/blogService');

const blogController = {
  async list(req, res) {
    try {
      const filters = {
        status: req.query.status,
        categoryId: req.query.categoryId
      };

      const pagination = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 20
      };

      const posts = await blogService.listPosts(filters, pagination);
      res.json(posts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async get(req, res) {
    try {
      const { id } = req.params;
      const post = await blogService.getPost(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const schema = z.object({
        title: z.string().min(3),
        content: z.string(),
        excerpt: z.string().optional(),
        categoryId: z.string().uuid().optional(),
        tagIds: z.array(z.string().uuid()).optional(),
        coverImage: z.string().url().optional(),
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
        publishedAt: z.date().optional()
      });

      const data = schema.parse(req.body);
      const post = await blogService.createPost(req.user.id, data);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
module.exports = {
  blogController
};