# ULTRIS 1 — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        ULTRIS 1                              │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │───▶│   Backend    │───▶│   MongoDB    │  │
│  │  React/Vite  │    │  Express.js  │    │  Database    │  │
│  │  TypeScript  │    │   Node.js    │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
frontend/
├── src/
│   ├── api/          # API client + endpoint modules
│   │   ├── client.ts # Axios instance with interceptors
│   │   ├── auth.ts   # Authentication API calls
│   │   ├── tools.ts  # Tools API calls
│   │   └── users.ts  # Users API calls
│   ├── context/      # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/        # Custom React hooks
│   │   └── useAuth.ts
│   ├── components/   # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/        # Route-level components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ToolPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── UltricomPage.tsx
│   ├── types/        # TypeScript type definitions
│   └── styles/       # Global CSS
```

## Backend Architecture

```
backend/src/
├── config/
│   ├── database.js   # MongoDB connection
│   └── env.js        # Environment validation
├── models/
│   ├── User.js       # User schema + methods
│   ├── Tool.js       # Tool schema
│   ├── Tier.js       # Subscription tier schema
│   └── Session.js    # Refresh token sessions
├── routes/
│   ├── auth.js       # /api/v1/auth/*
│   ├── users.js      # /api/v1/users/*
│   ├── tools.js      # /api/v1/tools/*
│   └── tiers.js      # /api/v1/tiers/*
├── middleware/
│   ├── auth.js       # JWT authentication + authorization
│   ├── errorHandler.js # Global error handler + AppError
│   ├── rateLimiter.js  # Express rate limiting
│   └── validate.js     # express-validator middleware
├── utils/
│   ├── logger.js     # Winston logger
│   └── jwt.js        # JWT utilities
└── swagger.js        # API documentation spec
```

## Authentication Flow

```
1. Register/Login
   ├── POST /api/v1/auth/register or /login
   ├── Returns: accessToken (15min) + refreshToken (7d)
   └── Sets httpOnly cookie with refreshToken

2. Authenticated Requests
   └── Authorization: ******

3. Token Refresh
   ├── POST /api/v1/auth/refresh
   ├── Sends refreshToken in cookie or body
   └── Returns new accessToken + rotated refreshToken

4. Logout
   └── POST /api/v1/auth/logout (invalidates session)
```

## Tier Access Control

```
Tier Hierarchy: free < coss < elite < founder

Tool Access:
├── free:    Xavier, Panthre, Soko (3 tools)
├── coss:    + Script, Quantus, Nexus, Cipher, Oracle (8 tools)
├── elite:   + Matrix, Forge, Vanguard, Axiom, Pulse, Nova (14 tools)
└── founder: All tools + lifetime access
```

## Security Measures

- **JWT**: Short-lived access tokens (15m) + rotating refresh tokens (7d)
- **bcrypt**: Password hashing with 12 rounds
- **Helmet**: HTTP security headers
- **CORS**: Whitelist-only origin policy
- **Rate Limiting**: 100 req/15min general, 10 req/15min auth
- **MongoDB Sanitization**: Prevent NoSQL injection
- **HPP**: HTTP Parameter Pollution protection
- **Input Validation**: express-validator on all inputs
- **Account Lockout**: After 5 failed login attempts (2h lock)
