const express = require('express');
const Tier = require('../models/Tier');
const { authenticate, authorize } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @swagger
 * /tiers:
 *   get:
 *     summary: Get all tiers
 *     tags: [Tiers]
 */
router.get('/', async (req, res, next) => {
  try {
    const tiers = await Tier.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data: { tiers } });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /tiers/{name}:
 *   get:
 *     summary: Get tier by name
 *     tags: [Tiers]
 */
router.get('/:name', async (req, res, next) => {
  try {
    const tier = await Tier.findOne({ name: req.params.name, isActive: true });
    if (!tier) return next(new AppError('Tier not found', 404));
    res.json({ success: true, data: { tier } });
  } catch (err) {
    next(err);
  }
});

// Admin routes below
/**
 * @swagger
 * /tiers:
 *   post:
 *     summary: Create tier (admin only)
 *     tags: [Tiers]
 */
router.post('/', authenticate, authorize('admin', 'superadmin'), async (req, res, next) => {
  try {
    const tier = await Tier.create(req.body);
    res.status(201).json({ success: true, data: { tier } });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authenticate, authorize('admin', 'superadmin'), async (req, res, next) => {
  try {
    const tier = await Tier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tier) return next(new AppError('Tier not found', 404));
    res.json({ success: true, data: { tier } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
