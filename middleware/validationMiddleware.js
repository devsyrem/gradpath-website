/**
 * GradPath — Validation Middleware
 * Uses express-validator to validate and sanitise request inputs.
 */

const { body, param, query, validationResult } = require('express-validator');
const { sanitiser } = require('../security');

/**
 * Generic handler that checks validation results and returns 400 if invalid.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
}

/*
 * ---------- Reusable validation chains ----------
 */

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validate,
];

const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required (max 50 chars)'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required (max 50 chars)'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .isIn(['student', 'academic_staff', 'placement_supervisor', 'admin'])
    .withMessage('Invalid role'),
  validate,
];

const placementValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required (max 200 chars)'),
  body('company')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Company name is required'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Description is required (max 5000 chars)'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  validate,
];

const reportValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Report title required'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 50000 })
    .withMessage('Report content required'),
  body('placementId')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Valid placement ID required'),
  validate,
];

const objectIdParam = [
  param('id').matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid ID format'),
  validate,
];

/**
 * Middleware to sanitise req.body, req.query, and req.params.
 */
function sanitiseInput(req, _res, next) {
  if (req.body) req.body = sanitiser.sanitiseObject(req.body);
  if (req.query) req.query = sanitiser.sanitiseObject(req.query);
  if (req.params) req.params = sanitiser.sanitiseObject(req.params);
  next();
}

module.exports = {
  validate,
  loginValidation,
  registerValidation,
  placementValidation,
  reportValidation,
  objectIdParam,
  sanitiseInput,
};
