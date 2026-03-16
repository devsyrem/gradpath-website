/**
 * GradPath — Auth Module Index
 */

const jwtService = require('./jwt');
const passwordService = require('./password');
const mfaService = require('./mfa');

module.exports = {
  jwt: jwtService,
  password: passwordService,
  mfa: mfaService,
};
