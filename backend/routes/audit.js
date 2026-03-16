/**
 * GradPath — Audit Routes (Admin only)
 * GET /api/audit            — query audit logs
 * GET /api/audit/stats      — dashboard statistics
 * GET /api/audit/user/:id   — auth logs for a specific user
 */

const express = require('express');
const router = express.Router();
const { auditService } = require('../../services');
const authMiddleware = require('../../middleware/authMiddleware');
const { requireRole } = require('../../middleware/roleMiddleware');
const config = require('../config');

router.use(authMiddleware);
router.use(requireRole(config.roles.ADMIN));

// GET /api/audit
router.get('/', async (req, res, next) => {
  try {
    const result = await auditService.query({
      userId: req.query.userId,
      action: req.query.action,
      resourceType: req.query.resourceType,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 50,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/audit/stats
router.get('/stats', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const stats = await auditService.getStats(days);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

// GET /api/audit/user/:userId
router.get('/user/:userId', async (req, res, next) => {
  try {
    const result = await auditService.getAuthLogs(req.params.userId, {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
