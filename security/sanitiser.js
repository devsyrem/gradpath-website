/**
 * GradPath — Input Sanitiser
 * Protects against XSS, injection, and other input-based attacks.
 */

/**
 * Strip dangerous characters / patterns from a string.
 */
function sanitiseString(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')          // basic HTML tag chars
    .replace(/javascript:/gi, '')  // JS protocol
    .replace(/on\w+=/gi, '')       // inline event handlers
    .replace(/data:/gi, '')        // data URIs
    .trim();
}

/**
 * Recursively sanitise all string values in an object.
 */
function sanitiseObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitiseString(obj);
  if (Array.isArray(obj)) return obj.map(sanitiseObject);
  if (typeof obj === 'object') {
    const sanitised = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitised[sanitiseString(key)] = sanitiseObject(value);
    }
    return sanitised;
  }
  return obj;
}

/**
 * Validate that a string matches an expected pattern.
 */
function isValidPattern(input, pattern) {
  return pattern.test(input);
}

/**
 * Validate an email address.
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate a MongoDB ObjectId string.
 */
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

module.exports = {
  sanitiseString,
  sanitiseObject,
  isValidPattern,
  isValidEmail,
  isValidObjectId,
};
