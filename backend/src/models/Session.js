const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    userAgent: String,
    ip: String,
    isValid: { type: Boolean, default: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    lastUsedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({ user: 1 });
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
