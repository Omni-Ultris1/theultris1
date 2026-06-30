# ULTRIS 1 — The Operating System for High-Performance Operators

> 14 precision tools. One unified system. Built for founders, analysts, and operators who move fast.

[![CI/CD](https://github.com/Omni-Ultris1/theultris1/actions/workflows/ci.yml/badge.svg)](https://github.com/Omni-Ultris1/theultris1/actions/workflows/ci.yml)

---

## 🔥 What is ULTRIS 1?

ULTRIS 1 is a full-stack SaaS platform providing enterprise-grade tools for high-performance operators. It features tier-based access control, JWT authentication, and a sleek terminal-aesthetic UI.

## 🛠 Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend** | Express.js + Node.js 20 |
| **Database** | MongoDB 7.0 + Mongoose |
| **Auth** | JWT (access + refresh) + bcrypt |
| **Security** | Helmet, CORS, Rate Limiting, Sanitization |
| **Logging** | Winston |
| **Testing** | Jest (backend) + Vitest (frontend) |
| **Containers** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |
| **Docs** | Swagger/OpenAPI |

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/Omni-Ultris1/theultris1.git
cd theultris1

# 2. Configure environment
cp .env.example .env
# Edit .env with your secrets

# 3. Start with Docker
docker compose up -d

# OR run manually:
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend
cd frontend && npm install && npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:5000
- API Docs: http://localhost:5000/api/v1/docs

## 📁 Structure

```
theultris1/
├── backend/          # Express.js API
│   ├── src/
│   │   ├── config/  # DB & env config
│   │   ├── models/  # Mongoose models
│   │   ├── routes/  # API routes
│   │   ├── middleware/ # Auth, errors, rate limiting
│   │   └── utils/   # Logger, JWT utils
│   └── tests/
├── frontend/         # React + TypeScript
│   └── src/
│       ├── api/     # API client + modules
│       ├── context/ # Auth context
│       ├── pages/   # All pages
│       ├── components/ # Reusable components
│       └── types/   # TypeScript types
├── docs/            # Documentation
├── scripts/         # DB seed scripts
├── docker-compose.yml
├── .env.example
└── .github/workflows/ci.yml
```

## 🔐 Security Features

- **JWT Authentication**: Short-lived access tokens (15m) + rotating refresh tokens (7d)
- **Password Security**: bcrypt with 12 rounds + complexity requirements
- **Rate Limiting**: 100 req/15min (API), 10 req/15min (auth)
- **Input Validation**: All inputs validated and sanitized
- **Security Headers**: Helmet.js + CSP
- **Account Lockout**: After 5 failed attempts

## 🎯 The 14 Tools

| Tool | Description | Tier |
|------|-------------|------|
| XAVIER | AI Research Engine | Free |
| PANTHRE | Competitive Analysis | Free |
| SOKO | Market Intelligence | Free |
| SCRIPT | Content Generator | COSS |
| QUANTUS | Financial Modeling | COSS |
| NEXUS | Network Connector | COSS |
| CIPHER | Data Encryption | COSS |
| ORACLE | Predictive Analytics | COSS |
| MATRIX | Data Visualization | Elite |
| FORGE | Product Builder | Elite |
| VANGUARD | Strategy Planner | Elite |
| AXIOM | Logic Framework | Elite |
| PULSE | Social Monitor | Elite |
| NOVA | Launch Engine | Elite |

## 📚 Documentation

- [Setup Guide](./docs/setup.md)
- [Architecture](./docs/architecture.md)
- [Deployment Guide](./docs/deployment.md)
- [API Docs](http://localhost:5000/api/v1/docs) (when running)

## 🧪 Testing

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# With coverage
cd backend && npm test -- --coverage
cd frontend && npm run test:coverage
```

## 📄 License

© 2024 ULTRIS 1. All rights reserved.
