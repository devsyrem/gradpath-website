/**
 * GradPath — Auth Unit Tests
 * Tests password hashing, JWT generation/verification, and password strength.
 */

// Set test env before loading modules
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-for-testing-only';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars!!';

const { password, jwt: jwtService } = require('../../auth');

describe('Password Service', () => {
  test('should hash a password and verify it', async () => {
    const plaintext = 'SecurePass123!';
    const hash = await password.hashPassword(plaintext);

    expect(hash).not.toBe(plaintext);
    expect(hash.length).toBeGreaterThan(0);

    const isMatch = await password.comparePassword(plaintext, hash);
    expect(isMatch).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const hash = await password.hashPassword('CorrectPass1!');
    const isMatch = await password.comparePassword('WrongPass1!', hash);
    expect(isMatch).toBe(false);
  });

  test('should validate strong password', () => {
    const result = password.validatePasswordStrength('MyStr0ng!Pass');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject weak password — too short', () => {
    const result = password.validatePasswordStrength('Ab1!');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/at least 8/);
  });

  test('should reject password without uppercase', () => {
    const result = password.validatePasswordStrength('lowercase1!');
    expect(result.valid).toBe(false);
  });

  test('should reject password without special character', () => {
    const result = password.validatePasswordStrength('NoSpecial1');
    expect(result.valid).toBe(false);
  });
});

describe('JWT Service', () => {
  const payload = { id: '507f1f77bcf86cd799439011', email: 'test@uni.edu', role: 'student' };

  test('should generate and verify an access token', () => {
    const token = jwtService.generateAccessToken(payload);
    expect(typeof token).toBe('string');

    const decoded = jwtService.verifyAccessToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.type).toBe('access');
  });

  test('should generate and verify a refresh token', () => {
    const token = jwtService.generateRefreshToken(payload);
    const decoded = jwtService.verifyRefreshToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded.id).toBe(payload.id);
    expect(decoded.type).toBe('refresh');
  });

  test('should reject a tampered token', () => {
    const token = jwtService.generateAccessToken(payload);
    const tampered = token + 'xyz';
    const decoded = jwtService.verifyAccessToken(tampered);
    expect(decoded).toBeNull();
  });

  test('should generate a token pair', () => {
    const pair = jwtService.generateTokenPair(payload);
    expect(pair).toHaveProperty('accessToken');
    expect(pair).toHaveProperty('refreshToken');
    expect(pair).toHaveProperty('expiresIn');
  });

  test('should not verify access token as refresh token', () => {
    const accessToken = jwtService.generateAccessToken(payload);
    const decoded = jwtService.verifyRefreshToken(accessToken);
    // Should be null because secret is different OR type check fails
    expect(decoded).toBeNull();
  });
});
