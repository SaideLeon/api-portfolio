// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { rateLimit } = require('express-rate-limit');

// Import routes
const authRoutes = require('./src/routes/auth');
const portfolioRoutes = require('./src/routes/portfolio');
const projectRoutes = require('./src/routes/projects');
const blogRoutes = require('./src/routes/blog');
const storeRoutes = require('./src/routes/store');
const contactRoutes = require('./src/routes/contact');
const analyticsRoutes = require('./src/routes/analytics');
const mediaRoutes = require('./src/routes/media');
const tagRoutes = require('./src/routes/tags');
const categoryRoutes = require('./src/routes/categories');

// Import error handler middleware
const errorHandler = require('./src/middlewares/errorHandler');
const notFoundHandler = require('./src/middlewares/notFoundHandler');

const app = express();

// Basic middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined')); // Request logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// API routes
app.use('/api/v1', [
  authRoutes,
  portfolioRoutes,
  projectRoutes,
  blogRoutes,
  storeRoutes,
  contactRoutes,
  analyticsRoutes,
  mediaRoutes,
  tagRoutes,
  categoryRoutes
]);

// API documentation route
app.get('/api/docs', (req, res) => {
  res.sendFile(__dirname + '/swagger.json');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

// server.js
require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Successfully connected to database');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Documentation available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
  console.log('Shutting down gracefully...');
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Start the server
startServer();