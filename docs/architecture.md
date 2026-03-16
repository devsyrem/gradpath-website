# GradPath — Architecture

## Overview

GradPath is a **Secure Student Work Placement Management and Reporting System** built for universities. It provides a web platform for managing the full placement lifecycle — from creation and approval through active tracking, reporting, and completion — with security, compliance, and data protection baked into every layer.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│         SPA · Vite · Role-Based UI · TLS            │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────┐
│                   API Gateway                        │
│   Helmet · CORS · Rate Limiter · Input Sanitiser     │
├──────────────────────────────────────────────────────┤
│                Express.js Backend                    │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Auth    │  │ Placement│  │  Report Service    │  │
│  │ Service  │  │ Service  │  │                    │  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       │              │                 │             │
│  ┌────▼──────────────▼─────────────────▼──────────┐  │
│  │            Middleware Stack                     │  │
│  │  authMiddleware → roleMiddleware →              │  │
│  │  validationMiddleware → auditMiddleware         │  │
│  └────────────────────┬───────────────────────────┘  │
├───────────────────────┼──────────────────────────────┤
│  ┌────────────────────▼───────────────────────────┐  │
│  │          Security Layer                        │  │
│  │  Encryption · RBAC Engine · Sanitiser          │  │
│  └────────────────────┬───────────────────────────┘  │
│  ┌────────────────────▼───────────────────────────┐  │
│  │          Database Layer (MongoDB)              │  │
│  │  User · Placement · Report · AuditLog          │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Directory Structure

```
/backend          — Express server, config, API routes
/auth             — JWT, password hashing, MFA services
/middleware        — Auth, RBAC, validation, audit, error middleware
/services         — Business logic (auth, placement, report, audit)
/database         — Mongoose connection and data models
/security         — Encryption, sanitisation, RBAC policy engine
/logging          — Winston structured logger
/frontend         — React SPA (Vite)
/tests            — Jest test suites (auth, api, security, integration)
/docs             — Project documentation
```

## Technology Stack

| Layer            | Technology         |
|------------------|--------------------|
| Frontend         | React + Vite       |
| Backend          | Node.js + Express  |
| Database         | MongoDB + Mongoose |
| Authentication   | JWT + bcrypt       |
| MFA              | TOTP (otplib)      |
| Encryption       | AES-256-CBC        |
| Logging          | Winston            |
| Testing          | Jest + Supertest   |
| Security Headers | Helmet             |

## Data Flow

1. Client sends request over HTTPS
2. Request passes through Helmet, CORS, Rate Limiter
3. Body is parsed and sanitised (XSS/injection protection)
4. Audit middleware records the request
5. Auth middleware validates JWT
6. Role middleware checks RBAC permissions
7. Validation middleware checks input schema
8. Service layer executes business logic
9. Database layer persists/retrieves data (encrypted where needed)
10. Response is returned with appropriate status and headers

## User Roles

| Role                  | Capabilities                                        |
|-----------------------|-----------------------------------------------------|
| Student               | View own placements/reports, submit reports          |
| Academic Staff        | Manage all placements, review reports, view students |
| Placement Supervisor  | Manage assigned placements, provide feedback         |
| Admin                 | Full system access, user management, audit logs      |
