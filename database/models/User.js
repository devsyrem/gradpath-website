/**
 * GradPath — User Model
 * Stores authentication credentials and profile info for all roles.
 */

const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../../security/encryption');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // never returned by default
    },
    role: {
      type: String,
      enum: ['student', 'academic_staff', 'placement_supervisor', 'admin'],
      required: [true, 'Role is required'],
    },
    // MFA
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, select: false },

    // Account state
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },

    // Refresh token (hashed)
    refreshToken: { type: String, select: false },

    // Profile (encrypted sensitive fields)
    phone: { type: String },
    studentId: { type: String },
    department: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.mfaSecret;
        delete ret.refreshToken;
        delete ret.__v;
        // Decrypt phone for the returned object
        if (ret.phone) {
          try {
            ret.phone = decrypt(ret.phone);
          } catch { /* field may not be encrypted */ }
        }
        return ret;
      },
    },
  }
);

// Encrypt phone before save
userSchema.pre('save', function (next) {
  if (this.isModified('phone') && this.phone) {
    this.phone = encrypt(this.phone);
  }
  next();
});

// Virtual: full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Check if account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Index for performance (email already has unique:true which creates an index)
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
