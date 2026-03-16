# GradPath — Changelog

All notable changes to this project will be documented in this file.

## Version: v1.0.0
Date: 2026-03-16

### Added
- Project initialisation with full directory structure
- Express.js backend with modular architecture
- JWT authentication service (access + refresh tokens)
- Password hashing with bcrypt (12 salt rounds)
- MFA support using TOTP (otplib + QR code generation)
- RBAC policy engine with 4 roles: student, academic_staff, placement_supervisor, admin
- AES-256-CBC encryption service for sensitive data at rest
- Input sanitisation service (XSS, injection protection)
- Authentication middleware (JWT verification)
- Role-based access control middleware
- Validation middleware using express-validator
- Audit logging middleware (request-level tracing)
- Centralised error handling middleware (safe production responses)
- MongoDB connection manager with retry logic
- User model with encrypted sensitive fields and account lockout
- Placement model with milestones, feedback, and status lifecycle
- Report model with review workflow (draft → submitted → reviewed)
- AuditLog model (immutable, append-only)
- Auth service (register, login, refresh, logout, MFA enable/disable)
- Placement service (CRUD, status updates, milestones, feedback)
- Report service (CRUD, submit, review, export)
- Audit service (query, stats, user auth logs)
- Auth API routes (/api/auth/*)
- Placement API routes (/api/placements/*)
- Report API routes (/api/reports/*)
- Audit API routes (/api/audit/*)
- User management API routes (/api/users/*)
- Health check endpoint (/api/health)
- Jest test suite: auth unit tests
- Jest test suite: security unit tests (encryption, sanitiser, RBAC)
- Jest test suite: middleware tests (auth, role)
- Jest test suite: API integration tests (health, headers, 404, validation)
- Architecture documentation
- Security model documentation
- API specification documentation
- Deployment guide
- This changelog

### Security
- Helmet for HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- CORS with configurable origin
- Rate limiting: 100 req/15min global, 20 req/15min for auth
- Account lockout after 5 failed login attempts (30-minute duration)
- Password strength enforcement (8+ chars, mixed case, digit, special)
- Sensitive fields encrypted at rest (AES-256-CBC with random IV)
- Passwords never stored or returned — bcrypt hash only
- Refresh tokens stored encrypted, invalidated on logout
- Token type checking prevents cross-use of access/refresh tokens
- Input sanitisation on all request bodies, params, and query strings
- Request body size limited to 1 MB
- MongoDB ObjectId format validation
- Stack traces never exposed in production
- Audit logs immutable at model level
- OWASP Top 10 coverage documented
