/**
 * GradPath — Middleware Index
 */

const authMiddleware = require('./authMiddleware');
const { requireRole, requirePermission } = require('./roleMiddleware');
const validationMiddleware = require('./validationMiddleware');
const auditMiddleware = require('./auditMiddleware');
const { notFound, errorHandler } = require('./errorMiddleware');

module.exports = {
  authMiddleware,
  requireRole,
  requirePermission,
  ...validationMiddleware,
  auditMiddleware,
  notFound,
  errorHandler,
};
