// src/controllers/storeController.js
const { z } = require('zod');
const { storeService } = require('../services/storeService');

const storeController = {
  async list(req, res) {
    try {
      const filters = {
        status: req.query.status,
        categoryId: req.query.categoryId,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined
      };

      const pagination = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 20
      };

      const products = await storeService.listProducts(filters, pagination);
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async createOrder(req, res) {
    try {
      const schema = z.object({
        customerEmail: z.string().email(),
        customerName: z.string(),
        shippingAddress: z.record(z.any()),
        billingAddress: z.record(z.any()).optional(),
        items: z.array(z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive(),
          price: z.number().positive(),
          name: z.string(),
          sku: z.string().optional()
        })),
        subtotal: z.number().positive(),
        shipping: z.number().min(0),
        tax: z.number().min(0),
        total: z.number().positive()
      });

      const data = schema.parse(req.body);
      const order = await storeService.createOrder(req.user.id, data);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
module.exports = {
  storeController
};