/**
 * GradPath — MFA (Multi-Factor Authentication) Service
 * TOTP-based MFA using otplib.
 */

const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const config = require('../backend/config');

/**
 * Generate a new MFA secret for a user.
 * @param {string} userEmail
 * @returns {Promise<{ secret: string, otpauthUrl: string, qrDataUrl: string }>}
 */
async function generateMFASecret(userEmail) {
  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(userEmail, config.mfa.issuer, secret);
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  return { secret, otpauthUrl, qrDataUrl };
}

/**
 * Verify a TOTP token against a secret.
 * @param {string} token – 6-digit code from the user
 * @param {string} secret – the user's stored MFA secret
 * @returns {boolean}
 */
function verifyMFAToken(token, secret) {
  return authenticator.verify({ token, secret });
}

module.exports = { generateMFASecret, verifyMFAToken };
