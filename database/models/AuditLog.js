/**
 * GradPath — Audit Log Model
 * Immutable record of system events for compliance.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now, required: true },
    userId: { type: String, required: true },
    userRole: { type: String, default: 'none' },
    action: { type: String, required: true },
    method: { type: String },
    path: { type: String },
    statusCode: { type: Number },
    ip: { type: String },
    userAgent: { type: String },
    duration: { type: Number }, // ms
    details: { type: mongoose.Schema.Types.Mixed },
    resourceType: { type: String },
    resourceId: { type: String },
    changes: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: false, // use our own timestamp field
    collection: 'audit_logs',
  }
);

// Audit logs are append-only — prevent updates and deletes at model level
auditLogSchema.pre('findOneAndUpdate', function () {
  throw new Error('Audit logs cannot be modified');
});
auditLogSchema.pre('findOneAndDelete', function () {
  throw new Error('Audit logs cannot be deleted');
});

// Indexes for efficient querying
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
