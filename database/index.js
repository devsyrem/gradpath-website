/**
 * GradPath — Database Models Index
 */

const User = require('./models/User');
const Placement = require('./models/Placement');
const Report = require('./models/Report');
const AuditLog = require('./models/AuditLog');
const { connectDB, disconnectDB } = require('./connection');

module.exports = {
  User,
  Placement,
  Report,
  AuditLog,
  connectDB,
  disconnectDB,
};
