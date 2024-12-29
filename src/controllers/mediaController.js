// src/controllers/mediaController.js
const { z } = require('zod');
const { mediaService } = require('../services/mediaService');

const mediaController = {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const schema = z.object({
        type: z.enum(['image', 'document', 'video']).optional(),
        folder: z.string().optional()
      });

      const data = schema.parse(req.body);
      const fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        ...data
      };

      const media = await mediaService.uploadMedia(req.user.id, fileData);
      res.status(201).json(media);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async list(req, res) {
    try {
      const filters = {
        mimeType: req.query.type
      };

      const media = await mediaService.listMedia(req.user.id, filters);
      res.json(media);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await mediaService.deleteMedia(id, req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async optimize(req, res) {
    try {
      const { id } = req.params;
      const schema = z.object({
        width: z.number().optional(),
        height: z.number().optional(),
        quality: z.number().min(1).max(100).optional(),
        format: z.enum(['jpeg', 'png', 'webp']).optional()
      });

      const options = schema.parse(req.body);
      const media = await mediaService.optimizeMedia(id, req.user.id, options);
      res.json(media);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
module.exports = {
  mediaController
};