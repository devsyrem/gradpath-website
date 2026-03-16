# GradPath — Security Model

## Design Principles

Security is the **primary design constraint** for GradPath. Every component is designed with a defence-in-depth approach.

### 1. Authentication

- **JWT-based** stateless authentication (access + refresh token pair)
- Access tokens are short-lived (15 min default)
- Refresh tokens are long-lived (7 days default) and stored encrypted server-side
- Passwords hashed with **bcrypt** (12 salt rounds)
- **MFA support** via TOTP (Google Authenticator / Authy compatible)
- Account lockout after 5 failed login attempts (30-minute lock)

### 2. Authorisation (RBAC)

Four roles with strictly defined permission sets:

| Permission              | Student | Academic Staff | Supervisor | Admin |
|-------------------------|---------|----------------|------------|-------|
| placement:read:own      | ✓       |                |            |       |
| placement:read:all      |         | ✓              |            | ✓     |
| placement:read:assigned |         |                | ✓          |       |
| placement:create        |         | ✓              |            | ✓     |
| placement:update        |         | ✓              |            | ✓     |
| placement:delete        |         |                |            | ✓     |
| placement:approve       |         | ✓              |            | ✓     |
| report:read:own         | ✓       |                |            |       |
| report:read:all         |         | ✓              |            | ✓     |
| report:create:own       | ✓       |                |            |       |
| user:manage             |         |                |            | ✓     |
| audit:read              |         |                |            | ✓     |

RBAC is enforced at the middleware level on every route.

### 3. Data Encryption

- **In transit**: TLS required (enforced at deployment)
- **At rest**: Sensitive fields (phone, MFA secrets) encrypted with **AES-256-CBC**
- Each encryption uses a random IV → same plaintext produces different ciphertext
- Passwords are one-way hashed (bcrypt) — never encrypted reversibly

### 4. Input Protection

- **express-validator** for schema validation on all endpoints
- Custom **sanitiser** strips HTML tags, `javascript:` URIs, inline event handlers, and `data:` URIs
- All request bodies, query params, and URL params are sanitised
- Request body size limited to 1 MB
- MongoDB ObjectId format validated before database queries

### 5. HTTP Security Headers (Helmet)

| Header                          | Purpose                          |
|---------------------------------|----------------------------------|
| Content-Security-Policy         | Prevent XSS, data injection      |
| X-Content-Type-Options: nosniff | Prevent MIME-type sniffing        |
| X-Frame-Options: DENY           | Prevent clickjacking              |
| Strict-Transport-Security       | Enforce HTTPS                    |
| X-XSS-Protection                | Legacy XSS filter                |
| Referrer-Policy                 | Control referer leakage          |

### 6. Rate Limiting

- Global: 100 requests per 15-minute window per IP
- Auth endpoints: 20 requests per 15 minutes per IP
- Returns `429 Too Many Requests` when exceeded

### 7. OWASP Top 10 Coverage

| Vulnerability                | Mitigation                                       |
|------------------------------|--------------------------------------------------|
| A01 Broken Access Control    | RBAC middleware, ownership checks                |
| A02 Cryptographic Failures   | AES-256 encryption, bcrypt hashing               |
| A03 Injection                | Input validation, sanitisation, parameterised DB |
| A04 Insecure Design          | Defence-in-depth, least privilege                |
| A05 Security Misconfiguration| Helmet, env-based config, no default secrets     |
| A06 Vulnerable Components    | Dependency auditing (npm audit)                  |
| A07 Auth Failures            | JWT, MFA, account lockout, strong passwords      |
| A08 Data Integrity Failures  | Input validation, immutable audit logs           |
| A09 Logging Failures         | Comprehensive audit logging, Winston             |
| A10 SSRF                     | No outbound requests from user input             |

### 8. Audit Trail

- Every API request is logged with: user ID, role, IP, path, method, status code, duration
- Logs written to file (combined, error, security) and database (AuditLog collection)
- Audit logs are **immutable** — model prevents updates and deletes
- Admin-only access to audit log queries and statistics

### 9. Session Security

- No server-side sessions (stateless JWT)
- Refresh tokens can be invalidated per-user (logout)
- Token type checking prevents cross-use of access/refresh tokens
- Failed login tracking with automatic account lockout

### 10. Error Handling

- Stack traces and internal messages **never** exposed in production
- All errors return a safe, generic message in production mode
- Errors are logged server-side with full context for debugging
