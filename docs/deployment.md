# GradPath — Deployment Guide

## Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** ≥ 6.x (local or Atlas)
- **npm** ≥ 9.x

## Local Development Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd gradpath-website

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values (especially secrets)

# 4. Start MongoDB (if local)
mongod --dbpath /data/db

# 5. Run the development server
npm run dev

# 6. Run tests
npm test
```

The server will start on `http://localhost:3000`.

## Environment Variables

| Variable              | Required | Description                          |
|-----------------------|----------|--------------------------------------|
| NODE_ENV              | yes      | `development`, `production`, `test`  |
| PORT                  | no       | Server port (default: 3000)          |
| MONGODB_URI           | yes      | MongoDB connection string            |
| JWT_SECRET            | yes      | Secret for signing access tokens     |
| JWT_REFRESH_SECRET    | yes      | Secret for signing refresh tokens    |
| ENCRYPTION_KEY        | yes      | Key for AES-256 field encryption     |
| CORS_ORIGIN           | no       | Allowed CORS origin                  |

⚠️ **Never use default/development secrets in production.** Generate cryptographically random secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Production Deployment

### Security Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate unique, random JWT secrets (≥ 64 characters)
- [ ] Generate unique encryption key (32 bytes)
- [ ] Enable TLS/HTTPS at the reverse proxy level
- [ ] Configure MongoDB with authentication enabled
- [ ] Set restrictive CORS_ORIGIN to your frontend domain
- [ ] Review rate limiting settings for expected traffic
- [ ] Run `npm audit` and resolve vulnerabilities
- [ ] Ensure log directory has appropriate permissions
- [ ] Set up log rotation for production logs

### Reverse Proxy (Nginx example)

```nginx
server {
    listen 443 ssl http2;
    server_name gradpath.example.edu;

    ssl_certificate     /etc/ssl/certs/gradpath.pem;
    ssl_certificate_key /etc/ssl/private/gradpath-key.pem;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /var/www/gradpath/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker (optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "backend/server.js"]
```

## Database

### Indexes

The application automatically creates indexes on startup via Mongoose schemas. Key indexes:

- `users.email` (unique)
- `users.role`
- `placements.student`, `placements.supervisor`, `placements.status`
- `reports.placement`, `reports.author`, `reports.status`
- `audit_logs.timestamp`, `audit_logs.userId`

### Backups

Set up regular MongoDB backups:

```bash
mongodump --uri="$MONGODB_URI" --out=/backups/$(date +%Y%m%d)
```

## Monitoring

- **Health check**: `GET /api/health` — returns `200` when the server is running
- **Logs**: Check `./logs/combined.log`, `./logs/error.log`, `./logs/security.log`
- **Audit stats**: `GET /api/audit/stats` (admin token required)
