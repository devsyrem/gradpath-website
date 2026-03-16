/**
 * GradPath — Application Configuration
 * Centralises all environment configuration with validation.
 */

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gradpath',
    name: process.env.DB_NAME || 'gradpath',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiry: process.env.JWT_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  encryption: {
    key: process.env.ENCRYPTION_KEY,
    ivLength: parseInt(process.env.ENCRYPTION_IV_LENGTH, 10) || 16,
  },

  mfa: {
    issuer: process.env.MFA_ISSUER || 'GradPath',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || './logs',
  },

  roles: {
    STUDENT: 'student',
    ACADEMIC_STAFF: 'academic_staff',
    PLACEMENT_SUPERVISOR: 'placement_supervisor',
    ADMIN: 'admin',
  },

  placementStatuses: [
    'pending',
    'approved',
    'active',
    'on_hold',
    'completed',
    'cancelled',
  ],
};

/**
 * Validate that critical config values are set in non-test environments.
 */
function validateConfig() {
  if (config.env === 'test') return;

  const required = ['jwt.secret', 'jwt.refreshSecret'];
  const missing = required.filter((key) => {
    const parts = key.split('.');
    let val = config;
    for (const p of parts) val = val?.[p];
    return !val;
  });

  if (missing.length) {
    console.warn(
      `⚠  Missing config values: ${missing.join(', ')}. Using defaults for development.`
    );

    // Provide safe development defaults — NEVER use in production
    if (!config.jwt.secret) config.jwt.secret = 'dev-jwt-secret-do-not-use-in-production';
    if (!config.jwt.refreshSecret)
      config.jwt.refreshSecret = 'dev-jwt-refresh-secret-do-not-use-in-production';
    if (!config.encryption.key)
      config.encryption.key = 'dev-encryption-key-32chars!!!!!';
  }
}

validateConfig();

module.exports = config;
