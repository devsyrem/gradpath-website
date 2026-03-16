/**
 * GradPath — JWT Service
 * Handles token generation, verification, and refresh.
 */

const jwt = require('jsonwebtoken');
const config = require('../backend/config');
const logger = require('../logging/logger');

/**
 * Generate an access token.
 * @param {Object} payload – { id, email, role }
 * @returns {string} signed JWT
 */
function generateAccessToken(payload) {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      type: 'access',
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiry }
  );
}

/**
 * Generate a refresh token.
 */
function generateRefreshToken(payload) {
  return jwt.sign(
    {
      id: payload.id,
      type: 'refresh',
    },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry }
  );
}

/**
 * Verify an access token.
 * @returns {Object|null} decoded payload or null
 */
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    if (decoded.type !== 'access') return null;
    return decoded;
  } catch (err) {
    logger.warn('JWT verification failed', { error: err.message });
    return null;
  }
}

/**
 * Verify a refresh token.
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret);
    if (decoded.type !== 'refresh') return null;
    return decoded;
  } catch (err) {
    logger.warn('Refresh token verification failed', { error: err.message });
    return null;
  }
}

/**
 * Generate a token pair (access + refresh).
 */
function generateTokenPair(payload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: config.jwt.expiry,
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
};
