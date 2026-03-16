/**
 * GradPath — Express Application Setup
 * Configures security middleware, routes, and error handling.
 */

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const config = require('./config');
const auditMiddleware = require('../middleware/auditMiddleware');
const { sanitiseInput } = require('../middleware/validationMiddleware');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/auth');
const placementRoutes = require('./routes/placements');
const reportRoutes = require('./routes/reports');
const auditRoutes = require('./routes/audit');
const userRoutes = require('./routes/users');

const app = express();

/*
 * ── Security Middleware ─────────────────────────────────────────
 */

// Helmet — secure HTTP headers (CSP, HSTS, X-Frame, etc.)
app.use(helmet());

// CORS
app.use(cors(config.cors));

// Rate limiting — prevent brute force / DDoS
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many authentication attempts. Try again later.' },
});
app.use('/api/auth/', authLimiter);

/*
 * ── Body Parsing ────────────────────────────────────────────────
 */

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(compression());

/*
 * ── Input Sanitisation ─────────────────────────────────────────
 */

app.use(sanitiseInput);

/*
 * ── Logging ─────────────────────────────────────────────────────
 */

if (config.env !== 'test') {
  app.use(morgan('short'));
}

/*
 * ── Audit Trail ─────────────────────────────────────────────────
 */

app.use(auditMiddleware);

/*
 * ── Health Check ────────────────────────────────────────────────
 */

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: require('../package.json').version,
  });
});

/*
 * ── API Routes ──────────────────────────────────────────────────
 */

app.use('/api/auth', authRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/users', userRoutes);

/*
 * ── Frontend (production) ───────────────────────────────────────
 * Serve the built React app. In development the Vite dev server
 * proxies /api requests to this Express instance instead.
 */

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// SPA fallback — any non-API route serves index.html
app.get(/^\/(?!api).*/, (_req, res, next) => {
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next(); // fall through to 404 handler if file missing
  });
});

/*
 * ── Error Handling ──────────────────────────────────────────────
 */

app.use(notFound);
app.use(errorHandler);

module.exports = app;
