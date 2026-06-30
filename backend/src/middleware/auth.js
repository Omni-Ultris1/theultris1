const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('-password -refreshTokens');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.warn('Authentication failed:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired', code: 'TOKEN_EXPIRED' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid access token' });
    }
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }
    next();
  };
};

const requireTier = (...tiers) => {
  const tierOrder = ['free', 'coss', 'elite', 'founder'];
  return (req, res, next) => {
    const userTierIndex = tierOrder.indexOf(req.user.tier);
    const requiredTierIndex = Math.min(...tiers.map((t) => tierOrder.indexOf(t)));
    if (userTierIndex < requiredTierIndex) {
      return res.status(403).json({
        success: false,
        message: 'Upgrade your plan to access this feature',
        requiredTier: tiers[0],
        currentTier: req.user.tier,
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize, requireTier };
