/**
 * GradPath — Placement Routes
 * Full CRUD + lifecycle management for placements.
 */

const express = require('express');
const router = express.Router();
const { placementService } = require('../../services');
const authMiddleware = require('../../middleware/authMiddleware');
const { requireRole, requirePermission } = require('../../middleware/roleMiddleware');
const {
  placementValidation,
  objectIdParam,
} = require('../../middleware/validationMiddleware');
const config = require('../config');
const { STUDENT, ACADEMIC_STAFF, PLACEMENT_SUPERVISOR, ADMIN } = config.roles;

// All placement routes require authentication
router.use(authMiddleware);

// GET /api/placements — list placements (role-filtered)
router.get('/', async (req, res, next) => {
  try {
    const result = await placementService.getAll({
      role: req.user.role,
      userId: req.user.id,
      status: req.query.status,
      company: req.query.company,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/placements/:id — single placement
router.get('/:id', objectIdParam, async (req, res, next) => {
  try {
    const placement = await placementService.getById(req.params.id, {
      role: req.user.role,
      userId: req.user.id,
    });
    res.json({ success: true, data: placement });
  } catch (err) {
    next(err);
  }
});

// POST /api/placements — create placement
router.post(
  '/',
  requireRole(ACADEMIC_STAFF, ADMIN),
  placementValidation,
  async (req, res, next) => {
    try {
      const placement = await placementService.create(req.body, req.user.id);
      res.status(201).json({ success: true, data: placement });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/placements/:id — update placement
router.put(
  '/:id',
  objectIdParam,
  requireRole(ACADEMIC_STAFF, PLACEMENT_SUPERVISOR, ADMIN),
  async (req, res, next) => {
    try {
      const placement = await placementService.update(req.params.id, req.body, {
        role: req.user.role,
        userId: req.user.id,
      });
      res.json({ success: true, data: placement });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/placements/:id/status — update status
router.patch(
  '/:id/status',
  objectIdParam,
  requireRole(ACADEMIC_STAFF, ADMIN),
  async (req, res, next) => {
    try {
      const { status } = req.body;
      if (!config.placementStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
      }
      const placement = await placementService.updateStatus(
        req.params.id,
        status,
        req.user.id
      );
      res.json({ success: true, data: placement });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/placements/:id/milestones — add milestone
router.post(
  '/:id/milestones',
  objectIdParam,
  requireRole(ACADEMIC_STAFF, PLACEMENT_SUPERVISOR, ADMIN),
  async (req, res, next) => {
    try {
      const placement = await placementService.addMilestone(
        req.params.id,
        req.body,
        req.user.id
      );
      res.status(201).json({ success: true, data: placement });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/placements/:id/milestones/:milestoneId
router.patch(
  '/:id/milestones/:milestoneId',
  requireRole(ACADEMIC_STAFF, PLACEMENT_SUPERVISOR, ADMIN),
  async (req, res, next) => {
    try {
      const placement = await placementService.updateMilestone(
        req.params.id,
        req.params.milestoneId,
        req.body,
        req.user.id
      );
      res.json({ success: true, data: placement });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/placements/:id/feedback — add feedback
router.post(
  '/:id/feedback',
  objectIdParam,
  requireRole(ACADEMIC_STAFF, PLACEMENT_SUPERVISOR, ADMIN),
  async (req, res, next) => {
    try {
      const placement = await placementService.addFeedback(
        req.params.id,
        req.body,
        { userId: req.user.id, role: req.user.role }
      );
      res.status(201).json({ success: true, data: placement });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/placements/:id
router.delete(
  '/:id',
  objectIdParam,
  requireRole(ADMIN),
  async (req, res, next) => {
    try {
      await placementService.delete(req.params.id, req.user.id);
      res.json({ success: true, message: 'Placement deleted' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
