/**
 * GradPath — Audit Service
 * Query and manage audit logs for compliance.
 */

const { AuditLog } = require('../database');
const logger = require('../logging/logger');

class AuditService {
  /**
   * Record a custom audit event (beyond automatic request logging).
   */
  async logEvent({
    userId,
    userRole,
    action,
    resourceType,
    resourceId,
    details,
    changes,
    ip,
  }) {
    const entry = await AuditLog.create({
      timestamp: new Date(),
      userId,
      userRole,
      action,
      resourceType,
      resourceId,
      details,
      changes,
      ip,
    });
    return entry;
  }

  /**
   * Query audit logs with filters.
   */
  async query({
    userId,
    action,
    resourceType,
    startDate,
    endDate,
    page = 1,
    limit = 50,
  }) {
    const filter = {};

    if (userId) filter.userId = userId;
    if (action) filter.action = new RegExp(action, 'i');
    if (resourceType) filter.resourceType = resourceType;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get authentication logs for a specific user.
   */
  async getAuthLogs(userId, { page = 1, limit = 20 } = {}) {
    return this.query({
      userId,
      action: 'POST /api/auth',
      page,
      limit,
    });
  }

  /**
   * Get admin action logs.
   */
  async getAdminLogs({ page = 1, limit = 50 } = {}) {
    return this.query({
      action: 'admin',
      page,
      limit,
    });
  }

  /**
   * Get summary statistics for the dashboard.
   */
  async getStats(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalEvents, authEvents, failedAuth] = await Promise.all([
      AuditLog.countDocuments({ timestamp: { $gte: since } }),
      AuditLog.countDocuments({
        timestamp: { $gte: since },
        action: /POST \/api\/auth\/login/i,
      }),
      AuditLog.countDocuments({
        timestamp: { $gte: since },
        action: /POST \/api\/auth\/login/i,
        statusCode: { $gte: 400 },
      }),
    ]);

    return { totalEvents, authEvents, failedAuth, period: `${days} days` };
  }
}

module.exports = new AuditService();
