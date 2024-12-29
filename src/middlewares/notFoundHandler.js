// src/middlewares/notFoundHandler.js
const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: 'The requested resource was not found'
  });
};
module.exports = {
  notFoundHandler
};