/**
 * GradPath — Auth Routes
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/refresh
 * POST /api/auth/logout
 * POST /api/auth/mfa/enable
 * POST /api/auth/mfa/disable
 */

const express = require('express');
const router = express.Router();
const { authService } = require('../../services');
const authMiddleware = require('../../middleware/authMiddleware');
const { loginValidation, registerValidation } = require('../../middleware/validationMiddleware');

// Register
router.post('/register', registerValidation, async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', loginValidation, async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }
    const tokens = await authService.refreshToken(refreshToken);
    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

// Logout (requires auth)
router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

// Enable MFA
router.post('/mfa/enable', authMiddleware, async (req, res, next) => {
  try {
    const result = await authService.enableMFA(req.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// Disable MFA
router.post('/mfa/disable', authMiddleware, async (req, res, next) => {
  try {
    const { mfaToken } = req.body;
    if (!mfaToken) {
      return res.status(400).json({ success: false, message: 'MFA token required to disable' });
    }
    await authService.disableMFA(req.user.id, mfaToken);
    res.json({ success: true, message: 'MFA disabled' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
