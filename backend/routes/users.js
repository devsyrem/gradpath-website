/**
 * GradPath — User Management Routes (Admin)
 */

const express = require('express');
const router = express.Router();
const { User } = require('../../database');
const authMiddleware = require('../../middleware/authMiddleware');
const { requireRole } = require('../../middleware/roleMiddleware');
const { objectIdParam } = require('../../middleware/validationMiddleware');
const config = require('../config');
const logger = require('../../logging/logger');

router.use(authMiddleware);

// GET /api/users — list users (admin and academic staff)
router.get(
  '/',
  requireRole(config.roles.ADMIN, config.roles.ACADEMIC_STAFF),
  async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.role) filter.role = req.query.role;
      if (req.query.active !== undefined) filter.isActive = req.query.active === 'true';

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        User.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: {
          users,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/users/me — current user profile
router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id
router.get(
  '/:id',
  objectIdParam,
  requireRole(config.roles.ADMIN, config.roles.ACADEMIC_STAFF),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/users/:id — admin update
router.put(
  '/:id',
  objectIdParam,
  requireRole(config.roles.ADMIN),
  async (req, res, next) => {
    try {
      // Prevent password changes through this route
      delete req.body.password;
      delete req.body.mfaSecret;
      delete req.body.refreshToken;

      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      logger.info('User updated by admin', { targetUserId: req.params.id, adminId: req.user.id });
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/users/:id/deactivate
router.patch(
  '/:id/deactivate',
  objectIdParam,
  requireRole(config.roles.ADMIN),
  async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      logger.info('User deactivated', { targetUserId: req.params.id, adminId: req.user.id });
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
