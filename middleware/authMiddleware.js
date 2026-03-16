/**
 * GradPath — Authentication Middleware
 * Validates JWT access tokens on protected routes.
 */

const { jwt: jwtService } = require('../auth');
const logger = require('../logging/logger');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Auth: missing or malformed Authorization header', {
      ip: req.ip,
      path: req.path,
    });
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Provide a valid Bearer token.',
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwtService.verifyAccessToken(token);

  if (!decoded) {
    logger.warn('Auth: invalid or expired token', { ip: req.ip, path: req.path });
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }

  // Attach decoded user info to request
  req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };

  next();
}

module.exports = authMiddleware;
