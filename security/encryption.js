/**
 * GradPath — Encryption Service
 * Provides AES-256-CBC encryption/decryption for sensitive data at rest.
 */

const crypto = require('crypto');
const config = require('../backend/config');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = config.encryption.ivLength || 16;

/**
 * Derive a 32-byte key from the configured encryption key.
 */
function deriveKey() {
  const raw = config.encryption.key || '';
  return crypto.createHash('sha256').update(raw).digest();
}

/**
 * Encrypt a plaintext string.
 * @param {string} text
 * @returns {string} iv:ciphertext (hex encoded)
 */
function encrypt(text) {
  if (!text) return text;
  const key = deriveKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt an encrypted string produced by encrypt().
 * @param {string} encryptedText  iv:ciphertext
 * @returns {string} plaintext
 */
function decrypt(encryptedText) {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  const key = deriveKey();
  const [ivHex, ciphertext] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Hash a value (one-way, for indexing encrypted fields).
 * @param {string} text
 * @returns {string} hex hash
 */
function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports = { encrypt, decrypt, hash };
