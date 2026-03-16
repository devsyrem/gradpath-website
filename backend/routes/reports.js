/**
 * GradPath — Report Routes
 * CRUD, submission, review, and export for reports.
 */

const express = require('express');
const router = express.Router();
const { reportService } = require('../../services');
const authMiddleware = require('../../middleware/authMiddleware');
const { requireRole } = require('../../middleware/roleMiddleware');
const { reportValidation, objectIdParam } = require('../../middleware/validationMiddleware');
const config = require('../config');
const { STUDENT, ACADEMIC_STAFF, PLACEMENT_SUPERVISOR, ADMIN } = config.roles;

router.use(authMiddleware);

// GET /api/reports
router.get('/', async (req, res, next) => {
  try {
    const result = await reportService.getAll({
      role: req.user.role,
      userId: req.user.id,
      placementId: req.query.placementId,
      status: req.query.status,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/reports/:id
router.get('/:id', objectIdParam, async (req, res, next) => {
  try {
    const report = await reportService.getById(req.params.id, {
      role: req.user.role,
      userId: req.user.id,
    });
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
});

// POST /api/reports — create report (students and staff)
router.post(
  '/',
  requireRole(STUDENT, ACADEMIC_STAFF, ADMIN),
  reportValidation,
  async (req, res, next) => {
    try {
      const report = await reportService.create(req.body, req.user.id);
      res.status(201).json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/reports/:id — update draft
router.put('/:id', objectIdParam, async (req, res, next) => {
  try {
    const report = await reportService.update(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
});

// POST /api/reports/:id/submit
router.post('/:id/submit', objectIdParam, async (req, res, next) => {
  try {
    const report = await reportService.submit(req.params.id, req.user.id);
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
});

// POST /api/reports/:id/review — approve or reject
router.post(
  '/:id/review',
  objectIdParam,
  requireRole(ACADEMIC_STAFF, PLACEMENT_SUPERVISOR, ADMIN),
  async (req, res, next) => {
    try {
      const report = await reportService.review(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/reports/export/:placementId — export approved reports
router.get(
  '/export/:placementId',
  requireRole(ACADEMIC_STAFF, ADMIN),
  async (req, res, next) => {
    try {
      const data = await reportService.exportPlacementReports(req.params.placementId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/reports/:id
router.delete('/:id', objectIdParam, async (req, res, next) => {
  try {
    await reportService.delete(req.params.id, {
      role: req.user.role,
      userId: req.user.id,
    });
    res.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
