const express = require('express');
const { body } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Validation rules
const registerRules = [
  body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 alphanumeric characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must include uppercase, lowercase, and number'),
];

const loginRules = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Helper: create session
const createSession = async (userId, { userAgent, ip }) => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await Session.create({
    user: userId,
    refreshToken,
    userAgent,
    ip,
    expiresAt,
  });

  return refreshToken;
};

// Helper: set refresh cookie
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth',
  });
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email or username already exists
 */
router.post('/register', authLimiter, registerRules, validate, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const field = existing.email === email ? 'email' : 'username';
      return next(new AppError(`${field.charAt(0).toUpperCase() + field.slice(1)} already registered`, 409));
    }

    const user = await User.create({ username, email, password });

    const accessToken = generateAccessToken({ userId: user._id, role: user.role, tier: user.tier });
    const refreshToken = await createSession(user._id, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    setRefreshCookie(res, refreshToken);

    logger.info(`User registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', authLimiter, loginRules, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (user.isLocked) {
      return next(new AppError('Account temporarily locked due to too many failed attempts. Try again in 2 hours.', 423));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incFailedLogin();
      return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Account is deactivated', 403));
    }

    await user.resetFailedLogin();

    const accessToken = generateAccessToken({ userId: user._id, role: user.role, tier: user.tier });
    const refreshToken = await createSession(user._id, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    setRefreshCookie(res, refreshToken);

    logger.info(`User logged in: ${user.email}`);

    // Remove password from response
    user.password = undefined;

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const rawToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!rawToken) {
      return next(new AppError('Refresh token required', 401));
    }
    // Accept only hex strings (our tokens are crypto.randomBytes(64).toString('hex'))
    const token = /^[0-9a-f]{128}$/i.test(rawToken) ? rawToken : null;
    if (!token) {
      return next(new AppError('Invalid refresh token format', 401));
    }

    const session = await Session.findOne({ refreshToken: token, isValid: true });
    if (!session || session.expiresAt < new Date()) {
      return next(new AppError('Invalid or expired refresh token', 401));
    }

    // Verify the JWT signature and expiration; capture decoded payload for logging
    const decoded = verifyRefreshToken(token);
    logger.info(`Refresh token used by userId: ${decoded.userId}`);

    const user = await User.findById(session.user);
    if (!user || !user.isActive) {
      return next(new AppError('User not found or deactivated', 401));
    }

    // Rotate refresh token
    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    session.refreshToken = newRefreshToken;
    session.lastUsedAt = new Date();
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await session.save();

    const accessToken = generateAccessToken({ userId: user._id, role: user.role, tier: user.tier });
    setRefreshCookie(res, newRefreshToken);

    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const rawToken = req.cookies.refreshToken || req.body.refreshToken;
    if (rawToken) {
      // Only process well-formed hex tokens
      const token = /^[0-9a-f]{128}$/i.test(rawToken) ? rawToken : null;
      if (token) {
        await Session.findOneAndUpdate({ refreshToken: token }, { isValid: false });
      }
    }

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    logger.info(`User logged out: ${req.user.email}`);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout-all', authenticate, async (req, res, next) => {
  try {
    await Session.updateMany({ user: req.user._id }, { isValid: false });
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    res.json({ success: true, message: 'Logged out from all devices' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
