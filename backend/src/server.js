require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const { validateEnv } = require('./config/env');
const { connectDB } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const swaggerSpec = require('./swagger');

// Validate environment variables
validateEnv();

const app = express();
const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

// =============================================================================
// Security Middleware
// =============================================================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.CLIENT_URL_PROD,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// =============================================================================
// Body Parsing & Sanitization
// =============================================================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());

// CSRF protection for cookie-bearing requests
const { csrfProtect } = require('./middleware/csrf');
app.use(csrfProtect);

// =============================================================================
// Logging
// =============================================================================
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (req) => req.url === '/health',
  }));
}

// =============================================================================
// Rate Limiting
// =============================================================================
app.use(`${API_PREFIX}/`, apiLimiter);

// =============================================================================
// Health Check
// =============================================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// =============================================================================
// API Documentation
// =============================================================================
if (process.env.NODE_ENV !== 'production') {
  app.use(`${API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'ULTRIS 1 API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  }));
}

// =============================================================================
// Routes
// =============================================================================
app.use(`${API_PREFIX}/auth`, require('./routes/auth'));
app.use(`${API_PREFIX}/users`, require('./routes/users'));
app.use(`${API_PREFIX}/tools`, require('./routes/tools'));
app.use(`${API_PREFIX}/tiers`, require('./routes/tiers'));

// =============================================================================
// Error Handling
// =============================================================================
app.use(notFound);
app.use(errorHandler);

// =============================================================================
// Database & Server Start
// =============================================================================
const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    logger.info(`ULTRIS 1 API running on port ${PORT} [${process.env.NODE_ENV}]`);
    logger.info(`API docs: http://localhost:${PORT}${API_PREFIX}/docs`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    shutdown('unhandledRejection');
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
