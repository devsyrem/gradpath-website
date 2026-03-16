# GradPath

**Secure Student Work Placement Management and Reporting System**

A secure web application designed for universities to manage student work placements with strong authentication, role-based access control, encrypted data handling, and full audit logging.

## Quick Start

```bash
npm install
cp .env.example .env    # configure your secrets
npm run dev             # start development server
npm test                # run test suite
```

## Features

- **Secure Authentication** — JWT with refresh tokens, bcrypt password hashing, optional MFA (TOTP)
- **Role-Based Access Control** — Student, Academic Staff, Placement Supervisor, Admin
- **Placement Lifecycle** — Create, approve, track, milestone management, supervisor feedback
- **Reporting System** — Draft → submit → review workflow with role-restricted access
- **Data Encryption** — AES-256-CBC encryption for sensitive fields at rest
- **Audit Trail** — Every API request logged with user context; immutable audit log
- **Security Hardened** — Helmet headers, rate limiting, input sanitisation, OWASP Top 10 coverage

## Documentation

- [Architecture](docs/architecture.md)
- [Security Model](docs/security-model.md)
- [API Specification](docs/api-spec.md)
- [Deployment Guide](docs/deployment.md)
- [Changelog](docs/changelog.md)

## Tech Stack

| Layer          | Technology         |
|----------------|--------------------|
| Backend        | Node.js · Express  |
| Database       | MongoDB · Mongoose |
| Authentication | JWT · bcrypt · TOTP|
| Encryption     | AES-256-CBC        |
| Testing        | Jest · Supertest   |
| Security       | Helmet · CORS · Rate Limiting |

## Project Structure

```
backend/       Express server, config, API routes
auth/          JWT, password, MFA services
middleware/    Auth, RBAC, validation, audit, error handling
services/      Business logic layer
database/      Models and connection management
security/      Encryption, sanitisation, RBAC engine
logging/       Structured logging (Winston)
tests/         Test suites
docs/          Documentation
```

## License

Private — University Project
