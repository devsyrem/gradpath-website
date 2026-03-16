/**
 * GradPath — Error Handling Middleware
 * Centralised error handler with safe error responses.
 */

const logger = require('../logging/logger');

/**
 * 404 handler for unknown routes.
 */
function notFound(req, res, _next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Global error handler.
 * Never leaks stack traces or internal details in production.
 */
function errorHandler(err, req, res, _next) {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
  });

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message: isProduction ? 'An internal error occurred.' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };
