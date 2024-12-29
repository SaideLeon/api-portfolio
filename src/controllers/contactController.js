// src/controllers/contactController.js
const { z } = require('zod');
const { contactService } = require('../services/contactService');

const contactController = {
  async send(req, res) {
    try {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().optional(),
        content: z.string().min(10),
        metadata: z.record(z.any()).optional()
      });

      const data = schema.parse(req.body);
      const message = await contactService.createMessage(req.user.id, data);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async list(req, res) {
    try {
      const filters = {
        status: req.query.status
      };

      const messages = await contactService.listMessages(req.user.id, filters);
      res.json(messages);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const message = await contactService.markMessageAsRead(id, req.user.id);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
module.exports = {
  contactController
};