/**
 * GradPath — Placement Model
 * Represents a student work placement record.
 */

const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    dueDate: { type: Date },
    completedDate: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'overdue'],
      default: 'pending',
    },
  },
  { _id: true, timestamps: true }
);

const feedbackSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorRole: { type: String, required: true },
    content: { type: String, required: true, maxlength: 5000 },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

const placementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Placement title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 5000,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 200,
    },
    location: { type: String, maxlength: 200 },

    // Relationships
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    academicAdvisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Timeline
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },

    // Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'active', 'on_hold', 'completed', 'cancelled'],
      default: 'pending',
    },

    // Embedded data
    milestones: [milestoneSchema],
    feedback: [feedbackSchema],

    // Metadata
    tags: [{ type: String, maxlength: 50 }],
    notes: { type: String, maxlength: 10000 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
placementSchema.virtual('durationWeeks').get(function () {
  if (!this.startDate || !this.endDate) return 0;
  const ms = this.endDate.getTime() - this.startDate.getTime();
  return Math.ceil(ms / (7 * 24 * 60 * 60 * 1000));
});

placementSchema.virtual('isOverdue').get(function () {
  return this.status === 'active' && this.endDate < new Date();
});

// Indexes
placementSchema.index({ student: 1 });
placementSchema.index({ supervisor: 1 });
placementSchema.index({ status: 1 });
placementSchema.index({ company: 1 });
placementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Placement', placementSchema);
