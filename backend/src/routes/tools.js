const express = require('express');
const { body, param, query } = require('express-validator');
const Tool = require('../models/Tool');
const { authenticate, authorize, requireTier } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @swagger
 * /tools:
 *   get:
 *     summary: Get all active tools
 *     tags: [Tools]
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const tierOrder = ['free', 'coss', 'elite', 'founder'];
    const userTierIndex = tierOrder.indexOf(req.user.tier);
    const accessibleTiers = tierOrder.slice(0, userTierIndex + 1);

    const filter = { isActive: true };
    // Whitelist allowed category values to prevent query injection
    const ALLOWED_CATEGORIES = ['ai', 'analytics', 'communication', 'productivity', 'research', 'finance'];
    if (req.query.category && ALLOWED_CATEGORIES.includes(String(req.query.category))) {
      filter.category = req.query.category;
    }

    const tools = await Tool.find(filter).sort({ sortOrder: 1, name: 1 });

    const toolsWithAccess = tools.map((tool) => ({
      ...tool.toJSON(),
      hasAccess: accessibleTiers.includes(tool.requiredTier),
    }));

    res.json({ success: true, data: { tools: toolsWithAccess } });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /tools/{slug}:
 *   get:
 *     summary: Get tool by slug
 *     tags: [Tools]
 */
router.get('/:slug', authenticate, async (req, res, next) => {
  try {
    const tool = await Tool.findOne({ slug: req.params.slug, isActive: true });
    if (!tool) return next(new AppError('Tool not found', 404));

    const tierOrder = ['free', 'coss', 'elite', 'founder'];
    const userTierIndex = tierOrder.indexOf(req.user.tier);
    const requiredTierIndex = tierOrder.indexOf(tool.requiredTier);

    if (userTierIndex < requiredTierIndex) {
      return res.status(403).json({
        success: false,
        message: 'Upgrade your plan to access this tool',
        requiredTier: tool.requiredTier,
        currentTier: req.user.tier,
        tool: {
          name: tool.name,
          displayName: tool.displayName,
          description: tool.description,
          requiredTier: tool.requiredTier,
        },
      });
    }

    // Increment usage count
    await Tool.findByIdAndUpdate(tool._id, { $inc: { usageCount: 1 } });

    res.json({ success: true, data: { tool } });
  } catch (err) {
    next(err);
  }
});

// Admin routes
router.use(authenticate);

/**
 * @swagger
 * /tools:
 *   post:
 *     summary: Create a new tool (admin only)
 *     tags: [Tools]
 */
router.post('/', authorize('admin', 'superadmin'), [
  body('name').trim().notEmpty(),
  body('slug').trim().toLowerCase().notEmpty(),
  body('displayName').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('category').isIn(['ai', 'analytics', 'communication', 'productivity', 'research', 'finance']),
  body('requiredTier').optional().isIn(['free', 'coss', 'elite', 'founder']),
], validate, async (req, res, next) => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json({ success: true, data: { tool } });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /tools/{id}:
 *   patch:
 *     summary: Update tool (admin only)
 *     tags: [Tools]
 */
router.patch('/:id', authorize('admin', 'superadmin'), [
  param('id').isMongoId(),
], validate, async (req, res, next) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tool) return next(new AppError('Tool not found', 404));
    res.json({ success: true, data: { tool } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
