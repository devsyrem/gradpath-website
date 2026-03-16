/**
 * GradPath — Services Index
 */

const authService = require('./authService');
const placementService = require('./placementService');
const reportService = require('./reportService');
const auditService = require('./auditService');

module.exports = {
  authService,
  placementService,
  reportService,
  auditService,
};
