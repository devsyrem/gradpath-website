/**
 * GradPath — Role Middleware
 * Enforces role-based access control on routes.
 */

const { rbac } = require('../security');
const logger = require('../logging/logger');

/**
 * Require the user to have one of the specified roles.
 * @param  {...string} allowedRoles
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No role assigned.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('RBAC: access denied', {
        userId: req.user.id,
        role: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path,
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient role privileges.',
      });
    }

    next();
  };
}

/**
 * Require the user to have a specific permission.
 * @param {string} permission
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user || !rbac.hasPermission(req.user.role, permission)) {
      logger.warn('RBAC: permission denied', {
        userId: req.user?.id,
        role: req.user?.role,
        permission,
        path: req.path,
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied. Missing required permission.',
      });
    }
    next();
  };
}

module.exports = { requireRole, requirePermission };
