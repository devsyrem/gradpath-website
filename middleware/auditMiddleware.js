/**
 * GradPath — Audit Middleware
 * Logs every API request with user context for compliance and traceability.
 */

const logger = require('../logging/logger');
const AuditLog = require('../database/models/AuditLog');

/**
 * Log every request to the audit trail.
 */
function auditMiddleware(req, res, next) {
  const startTime = Date.now();

  // Capture response on finish
  res.on('finish', async () => {
    const duration = Date.now() - startTime;

    const auditEntry = {
      timestamp: new Date(),
      userId: req.user?.id || 'anonymous',
      userRole: req.user?.role || 'none',
      action: `${req.method} ${req.originalUrl}`,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
      duration,
    };

    // Log to file immediately
    logger.info('AUDIT', auditEntry);

    // Persist to database (non-blocking)
    try {
      if (AuditLog && typeof AuditLog.create === 'function') {
        await AuditLog.create(auditEntry);
      }
    } catch (err) {
      logger.error('Failed to persist audit log', { error: err.message });
    }
  });

  next();
}

module.exports = auditMiddleware;
