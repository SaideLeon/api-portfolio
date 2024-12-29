// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err);

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      status: 'error',
      code: err.code,
      message: 'Database operation failed'
    });
  }

  // Handle validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.errors
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Invalid authentication token'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    status: 'error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
};



module.exports = {
  errorHandler,
  notFoundHandler
};