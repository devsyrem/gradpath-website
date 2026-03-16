/**
 * GradPath — API Middleware Tests
 * Tests authentication and role middleware.
 */

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-for-testing-only';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars!!';

const { jwt: jwtService } = require('../../auth');
const authMiddleware = require('../../middleware/authMiddleware');
const { requireRole } = require('../../middleware/roleMiddleware');

// Mock req/res/next
function mockReq(overrides = {}) {
  return {
    headers: {},
    ip: '127.0.0.1',
    path: '/test',
    ...overrides,
  };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('Auth Middleware', () => {
  test('should reject request without Authorization header', () => {
    const req = mockReq();
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject invalid token', () => {
    const req = mockReq({ headers: { authorization: 'Bearer invalid.token.here' } });
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should allow valid token and attach user to req', () => {
    const payload = { id: '507f1f77bcf86cd799439011', email: 'test@uni.edu', role: 'student' };
    const token = jwtService.generateAccessToken(payload);

    const req = mockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(req.user.role).toBe('student');
  });
});

describe('Role Middleware', () => {
  test('should allow user with matching role', () => {
    const middleware = requireRole('admin', 'academic_staff');
    const req = mockReq({ user: { id: '1', role: 'admin' } });
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should reject user with non-matching role', () => {
    const middleware = requireRole('admin');
    const req = mockReq({ user: { id: '1', role: 'student' } });
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject request without user', () => {
    const middleware = requireRole('admin');
    const req = mockReq();
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
