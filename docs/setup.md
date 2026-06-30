# ULTRIS 1 — Production Setup Guide

## Prerequisites

- Node.js 18+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

## Quick Start

### 1. Clone & Environment Setup

```bash
git clone https://github.com/Omni-Ultris1/theultris1.git
cd theultris1
cp .env.example .env
# Edit .env with your values
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`
API Docs: `http://localhost:5000/api/v1/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## Docker Setup (Recommended for Production)

```bash
# Copy and configure environment
cp .env.example .env
# Set JWT_SECRET, JWT_REFRESH_SECRET, MONGO_ROOT_PASSWORD

# Start all services
docker compose up -d

# View logs
docker compose logs -f backend
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | ✅ |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) | ✅ |
| `CLIENT_URL` | Frontend URL for CORS | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |
| `PORT` | API server port (default: 5000) | ❌ |
| `BCRYPT_ROUNDS` | Password hash rounds (default: 12) | ❌ |

## Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# With coverage
cd backend && npm run test -- --coverage
cd frontend && npm run test:coverage
```

## Production Deployment

See [deployment.md](./deployment.md) for full deployment guide.

## Architecture

See [architecture.md](./architecture.md) for system architecture.

## API Reference

See [api.md](./api.md) or visit `/api/v1/docs` when running the server.
