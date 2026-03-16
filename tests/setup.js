/**
 * GradPath — Test Setup
 * Configures test environment variables before the suite runs.
 */

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-for-testing-only';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars!!';
process.env.LOG_LEVEL = 'silent';
