const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const createLimiter = (options) =>
  rateLimit({
    windowMs: options.windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: options.max || parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded: ${req.ip} - ${req.originalUrl}`);
      res.status(429).json({
        success: false,
        message: options.message || 'Too many requests, please try again later',
      });
    },
    ...options,
  });

// General API limiter
const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: 'Too many API requests, please try again after 15 minutes',
});

// Strict auth limiter
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10,
  message: 'Too many authentication attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true,
});

module.exports = { apiLimiter, authLimiter, createLimiter };
