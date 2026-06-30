const express = require('express');
const { body, param, query } = require('express-validator');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authorize('admin', 'superadmin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('tier').optional().isIn(['free', 'coss', 'elite', 'founder']),
  query('search').optional().trim(),
], validate, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.tier) filter.tier = req.query.tier;
    if (req.query.search) {
      // Escape regex special characters to prevent ReDoS / NoSQL regex injection
      const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { username: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 */
router.get('/profile', (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 */
router.patch('/profile', [
  body('profile.displayName').optional().trim().isLength({ max: 50 }),
  body('profile.bio').optional().trim().isLength({ max: 500 }),
], validate, async (req, res, next) => {
  try {
    const allowedFields = ['profile'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Profile updated', data: { user } });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 */
router.post('/change-password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
], validate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (admin only)
 *     tags: [Users]
 */
router.get('/:id', authorize('admin', 'superadmin'), [
  param('id').isMongoId().withMessage('Invalid user ID'),
], validate, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user (admin only)
 *     tags: [Users]
 */
router.patch('/:id', authorize('admin', 'superadmin'), [
  param('id').isMongoId(),
  body('tier').optional().isIn(['free', 'coss', 'elite', 'founder']),
  body('role').optional().isIn(['user', 'admin']),
  body('isActive').optional().isBoolean(),
], validate, async (req, res, next) => {
  try {
    const allowedFields = ['tier', 'role', 'isActive'];
    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return next(new AppError('User not found', 404));

    res.json({ success: true, message: 'User updated', data: { user } });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deactivate user (admin only)
 *     tags: [Users]
 */
router.delete('/:id', authorize('admin', 'superadmin'), [
  param('id').isMongoId(),
], validate, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, message: 'User deactivated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
