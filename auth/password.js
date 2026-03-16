/**
 * GradPath — Password Service
 * Secure hashing and comparison using bcrypt.
 */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password.
 * @param {string} password
 * @returns {Promise<string>} hashed password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plaintext password to a hash.
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Validate password strength.
 * Requires: 8+ chars, uppercase, lowercase, digit, special character.
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validatePasswordStrength(password) {
  const errors = [];
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain a digit');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    errors.push('Password must contain a special character');

  return { valid: errors.length === 0, errors };
}

module.exports = { hashPassword, comparePassword, validatePasswordStrength };
