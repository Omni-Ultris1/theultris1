const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['free', 'coss', 'elite', 'founder'],
    },
    displayName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annually', 'lifetime'],
      default: 'monthly',
    },
    features: [String],
    toolAccess: [
      {
        type: String,
        ref: 'Tool',
      },
    ],
    maxToolsPerDay: { type: Number, default: -1 }, // -1 = unlimited
    apiCallsPerMonth: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    stripePriceId: String,
    stripeProductId: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

module.exports = mongoose.model('Tier', tierSchema);
