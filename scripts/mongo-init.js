// MongoDB initialization script
// Runs on first startup to create application user and seed data

db = db.getSiblingDB('ultris1');

// Seed tiers
db.tiers.insertMany([
  {
    name: 'free',
    displayName: 'FREE',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['Access to 3 core tools', 'Community support', 'Basic analytics'],
    toolAccess: [],
    maxToolsPerDay: 10,
    apiCallsPerMonth: 0,
    isActive: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'coss',
    displayName: 'COSS',
    price: 29,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['Access to 8 tools', 'Priority support', 'Full analytics', 'API access (100 calls/mo)', 'ULTRICOM community'],
    toolAccess: [],
    maxToolsPerDay: 50,
    apiCallsPerMonth: 100,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'elite',
    displayName: 'ELITE',
    price: 97,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['Access to all 14 tools', '24/7 support', 'Advanced analytics', 'API access (1000 calls/mo)', 'ULTRICOM community'],
    toolAccess: [],
    maxToolsPerDay: -1,
    apiCallsPerMonth: 1000,
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'founder',
    displayName: 'FOUNDER',
    price: 497,
    currency: 'USD',
    billingCycle: 'lifetime',
    features: ['Everything in Elite', 'Lifetime access', 'Founder badge', 'Direct team access', 'Early feature access', 'Unlimited API calls'],
    toolAccess: [],
    maxToolsPerDay: -1,
    apiCallsPerMonth: -1,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// Seed tools
var tools = [
  { name: 'XAVIER', slug: 'xavier', displayName: 'XAVIER', description: 'AI Research Engine', category: 'ai', requiredTier: 'free', sortOrder: 0 },
  { name: 'PANTHRE', slug: 'panthre', displayName: 'PANTHRE', description: 'Competitive Analysis', category: 'analytics', requiredTier: 'free', sortOrder: 1 },
  { name: 'SOKO', slug: 'soko', displayName: 'SOKO', description: 'Market Intelligence', category: 'research', requiredTier: 'free', sortOrder: 2 },
  { name: 'SCRIPT', slug: 'script', displayName: 'SCRIPT', description: 'Content Generator', category: 'productivity', requiredTier: 'coss', sortOrder: 3 },
  { name: 'QUANTUS', slug: 'quantus', displayName: 'QUANTUS', description: 'Financial Modeling', category: 'finance', requiredTier: 'coss', sortOrder: 4 },
  { name: 'NEXUS', slug: 'nexus', displayName: 'NEXUS', description: 'Network Connector', category: 'communication', requiredTier: 'coss', sortOrder: 5 },
  { name: 'CIPHER', slug: 'cipher', displayName: 'CIPHER', description: 'Data Encryption', category: 'ai', requiredTier: 'coss', sortOrder: 6 },
  { name: 'ORACLE', slug: 'oracle', displayName: 'ORACLE', description: 'Predictive Analytics', category: 'analytics', requiredTier: 'coss', sortOrder: 7 },
  { name: 'MATRIX', slug: 'matrix', displayName: 'MATRIX', description: 'Data Visualization', category: 'analytics', requiredTier: 'elite', sortOrder: 8 },
  { name: 'FORGE', slug: 'forge', displayName: 'FORGE', description: 'Product Builder', category: 'productivity', requiredTier: 'elite', sortOrder: 9 },
  { name: 'VANGUARD', slug: 'vanguard', displayName: 'VANGUARD', description: 'Strategy Planner', category: 'productivity', requiredTier: 'elite', sortOrder: 10 },
  { name: 'AXIOM', slug: 'axiom', displayName: 'AXIOM', description: 'Logic Framework', category: 'research', requiredTier: 'elite', sortOrder: 11 },
  { name: 'PULSE', slug: 'pulse', displayName: 'PULSE', description: 'Social Monitor', category: 'communication', requiredTier: 'elite', sortOrder: 12 },
  { name: 'NOVA', slug: 'nova', displayName: 'NOVA', description: 'Launch Engine', category: 'productivity', requiredTier: 'elite', sortOrder: 13 },
];

db.tools.insertMany(tools.map(function(t) {
  return Object.assign({}, t, {
    isActive: true,
    isFeatured: t.sortOrder < 3,
    version: '1.0.0',
    usageCount: 0,
    avgRating: 0,
    ratingCount: 0,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}));

print('ULTRIS 1 database initialized');
