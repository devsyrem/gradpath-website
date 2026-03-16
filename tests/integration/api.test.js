/**
 * GradPath — API Integration Tests (using supertest)
 * Tests the health endpoint and auth routes without a live DB.
 */

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-for-testing-only';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars!!';

const request = require('supertest');
const app = require('../../backend/app');

describe('Health Check', () => {
  test('GET /api/health should return 200 with status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('version');
  });
});

describe('Security Headers', () => {
  test('Response should include Helmet security headers', async () => {
    const res = await request(app).get('/api/health');
    // Helmet sets these headers
    expect(res.headers).toHaveProperty('x-content-type-options');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});

describe('404 Handling', () => {
  test('Unknown routes should return 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Auth Routes — Validation', () => {
  test('POST /api/auth/login without body should return 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/auth/register with invalid email should return 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      password: 'Short1!',
      role: 'student',
    });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register with invalid role should return 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@uni.edu',
      password: 'StrongPass1!',
      role: 'hacker',
    });
    expect(res.status).toBe(400);
  });
});

describe('Protected Routes — Without Token', () => {
  test('GET /api/placements should return 401 without token', async () => {
    const res = await request(app).get('/api/placements');
    expect(res.status).toBe(401);
  });

  test('GET /api/reports should return 401 without token', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toBe(401);
  });

  test('GET /api/audit should return 401 without token', async () => {
    const res = await request(app).get('/api/audit');
    expect(res.status).toBe(401);
  });

  test('GET /api/users/me should return 401 without token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });
});
