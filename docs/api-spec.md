# GradPath — API Specification

Base URL: `/api`

All responses follow this structure:
```json
{
  "success": true|false,
  "data": { ... },
  "message": "...",
  "errors": [{ "field": "...", "message": "..." }]
}
```

---

## Authentication

### POST /api/auth/register
Create a new user account.

**Body:**
| Field     | Type   | Required | Description                                              |
|-----------|--------|----------|----------------------------------------------------------|
| firstName | string | yes      | 1–50 characters                                          |
| lastName  | string | yes      | 1–50 characters                                          |
| email     | string | yes      | Valid email address                                      |
| password  | string | yes      | Min 8 chars, uppercase, lowercase, digit, special char   |
| role      | string | yes      | `student`, `academic_staff`, `placement_supervisor`, `admin` |

**Response:** `201` — `{ user, accessToken, refreshToken, expiresIn }`

---

### POST /api/auth/login
Authenticate and receive tokens.

**Body:**
| Field    | Type   | Required | Description       |
|----------|--------|----------|-------------------|
| email    | string | yes      | Registered email  |
| password | string | yes      | Account password  |
| mfaToken | string | no       | 6-digit TOTP code |

**Response:** `200` — `{ user, accessToken, refreshToken, expiresIn }`  
If MFA enabled and no token: `200` — `{ requiresMFA: true }`

---

### POST /api/auth/refresh
Refresh an expired access token.

**Body:** `{ refreshToken: string }`  
**Response:** `200` — `{ accessToken, refreshToken, expiresIn }`

---

### POST /api/auth/logout
🔒 Authenticated  
Invalidate the current refresh token.

**Response:** `200` — `{ message: "Logged out successfully" }`

---

### POST /api/auth/mfa/enable
🔒 Authenticated  
Enable MFA for the current user.

**Response:** `200` — `{ qrDataUrl: string }` (data URI for QR code)

---

### POST /api/auth/mfa/disable
🔒 Authenticated  
Disable MFA (requires valid TOTP token for verification).

**Body:** `{ mfaToken: string }`  
**Response:** `200`

---

## Placements

All placement routes require authentication (`Authorization: Bearer <token>`).

### GET /api/placements
List placements (filtered by role).

**Query params:** `status`, `company`, `page`, `limit`  
**Response:** `200` — `{ placements: [...], pagination: {...} }`

---

### GET /api/placements/:id
Get a single placement.

**Response:** `200` — full placement with populated references

---

### POST /api/placements
🔒 Academic Staff, Admin  
Create a new placement.

**Body:**
| Field       | Type   | Required | Description     |
|-------------|--------|----------|-----------------|
| title       | string | yes      | Max 200 chars   |
| company     | string | yes      | Max 200 chars   |
| description | string | yes      | Max 5000 chars  |
| startDate   | date   | yes      | ISO 8601        |
| endDate     | date   | yes      | ISO 8601        |
| student     | string | yes      | User ObjectId   |
| supervisor  | string | no       | User ObjectId   |

**Response:** `201`

---

### PUT /api/placements/:id
🔒 Academic Staff, Supervisor, Admin  
Update a placement.

---

### PATCH /api/placements/:id/status
🔒 Academic Staff, Admin  
Update placement status.

**Body:** `{ status: "pending"|"approved"|"active"|"on_hold"|"completed"|"cancelled" }`

---

### POST /api/placements/:id/milestones
🔒 Academic Staff, Supervisor, Admin  
Add a milestone.

**Body:** `{ title, description, dueDate }`

---

### PATCH /api/placements/:id/milestones/:milestoneId
Update a milestone.

---

### POST /api/placements/:id/feedback
🔒 Academic Staff, Supervisor, Admin  
Add feedback.

**Body:** `{ content: string, rating: 1-5 }`

---

### DELETE /api/placements/:id
🔒 Admin only

---

## Reports

### GET /api/reports
List reports (role-filtered).

### GET /api/reports/:id
Get single report.

### POST /api/reports
🔒 Student, Academic Staff, Admin  
Create report.

**Body:** `{ title, content, placementId, type?, tags? }`

### PUT /api/reports/:id
Update a draft report (author only).

### POST /api/reports/:id/submit
Submit report for review.

### POST /api/reports/:id/review
🔒 Academic Staff, Supervisor, Admin  
Approve or reject.

**Body:** `{ status: "approved"|"rejected", comments: string }`

### GET /api/reports/export/:placementId
🔒 Academic Staff, Admin  
Export approved reports for a placement.

### DELETE /api/reports/:id

---

## Users

### GET /api/users/me
🔒 Authenticated  
Current user profile.

### GET /api/users
🔒 Admin, Academic Staff  
List users with filters.

### GET /api/users/:id
🔒 Admin, Academic Staff

### PUT /api/users/:id
🔒 Admin

### PATCH /api/users/:id/deactivate
🔒 Admin

---

## Audit Logs

### GET /api/audit
🔒 Admin  
Query audit logs.

**Query:** `userId`, `action`, `resourceType`, `startDate`, `endDate`, `page`, `limit`

### GET /api/audit/stats
🔒 Admin  
Dashboard statistics (events, auth attempts, failures).

### GET /api/audit/user/:userId
🔒 Admin  
Auth logs for a specific user.

---

## Health

### GET /api/health
No auth required.

**Response:** `200` — `{ status: "healthy", timestamp, version }`
