# ULTRIS 1 — Deployment Guide

## Production Checklist

- [ ] Set strong `JWT_SECRET` (64+ random chars)
- [ ] Set strong `JWT_REFRESH_SECRET` (64+ random chars)
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB with auth
- [ ] Set `CLIENT_URL` to your domain
- [ ] Configure SSL/TLS (Let's Encrypt recommended)
- [ ] Set up monitoring (Sentry DSN)
- [ ] Configure SMTP for emails

## Docker Deployment

### 1. Server Setup

```bash
# Install Docker & Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin
```

### 2. Configure Environment

```bash
cp .env.example .env

# Generate secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Edit .env
nano .env
```

### 3. Deploy

```bash
# Build and start
docker compose up -d --build

# Check status
docker compose ps
docker compose logs -f

# Update
git pull
docker compose up -d --build
```

## Netlify Deployment (Frontend Only)

```bash
cd frontend
npm run build

# Deploy dist/ to Netlify
```

### netlify.toml

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Environment Variables for Production

```bash
# Generate secure secrets
JWT_SECRET=$(openssl rand -hex 64)
JWT_REFRESH_SECRET=$(openssl rand -hex 64)
MONGO_ROOT_PASSWORD=$(openssl rand -hex 32)
```

## Monitoring & Logs

```bash
# View logs
docker compose logs -f backend

# Backend logs are in
./backend-logs/app.log
./backend-logs/error.log
```

## Backup

```bash
# MongoDB backup
docker compose exec mongodb mongodump \
  --uri="mongodb://admin:${MONGO_ROOT_PASSWORD}@localhost:27017/ultris1?authSource=admin" \
  --out=/backup/$(date +%Y%m%d)

# Copy from container
docker compose cp mongodb:/backup ./backups
```
