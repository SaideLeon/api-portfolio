// src/controllers/projectController.js
const { z } = require('zod');
const { projectService } = require('../services/projectService');

const projectController = {
  async list(req, res) {
    try {
      const filters = {
        status: req.query.status,
        categoryId: req.query.categoryId,
        featured: req.query.featured === 'true'
      };

      const pagination = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 20
      };

      const projects = await projectService.listProjects(filters, pagination);
      res.json(projects);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async get(req, res) {
    try {
      const { id } = req.params;
      const project = await projectService.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const schema = z.object({
        title: z.string().min(3),
        description: z.string(),
        content: z.string().optional(),
        categoryId: z.string().uuid().optional(),
        tagIds: z.array(z.string().uuid()).optional(),
        featured: z.boolean().optional(),
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
        metadata: z.record(z.any()).optional()
      });

      const data = schema.parse(req.body);
      const project = await projectService.createProject(req.user.id, data);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const schema = z.object({
        title: z.string().min(3).optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        categoryId: z.string().uuid().optional(),
        tagIds: z.array(z.string().uuid()).optional(),
        featured: z.boolean().optional(),
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
        metadata: z.record(z.any()).optional()
      });

      const data = schema.parse(req.body);
      const project = await projectService.updateProject(id, req.user.id, data);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await projectService.deleteProject(id, req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
module.exports = {
  projectController
};