const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['ai', 'analytics', 'communication', 'productivity', 'research', 'finance'],
      required: true,
    },
    icon: String,
    coverImage: String,
    requiredTier: {
      type: String,
      enum: ['free', 'coss', 'elite', 'founder'],
      default: 'free',
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    version: { type: String, default: '1.0.0' },
    endpoint: String,
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    usageCount: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    tags: [String],
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Indexes
toolSchema.index({ slug: 1 });
toolSchema.index({ requiredTier: 1 });
toolSchema.index({ category: 1 });
toolSchema.index({ isActive: 1 });

module.exports = mongoose.model('Tool', toolSchema);
