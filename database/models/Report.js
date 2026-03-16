/**
 * GradPath — Report Model
 * Represents student placement reports.
 */

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Report content is required'],
      maxlength: 50000,
    },
    type: {
      type: String,
      enum: ['weekly', 'monthly', 'final', 'incident', 'progress'],
      default: 'progress',
    },

    // Relationships
    placement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Placement',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Review workflow
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
      default: 'draft',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: { type: Date },
    reviewComments: { type: String, maxlength: 5000 },

    // Metadata
    submittedAt: { type: Date },
    tags: [{ type: String, maxlength: 50 }],
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ placement: 1 });
reportSchema.index({ author: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
