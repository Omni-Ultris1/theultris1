const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  API_VERSION: Joi.string().default('v1'),
  APP_NAME: Joi.string().default('ULTRIS1'),

  CLIENT_URL: Joi.string().uri().default('http://localhost:3000'),
  CLIENT_URL_PROD: Joi.string().uri().optional(),

  MONGODB_URI: Joi.string().required(),
  MONGODB_URI_TEST: Joi.string().optional(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  BCRYPT_ROUNDS: Joi.number().min(10).max(14).default(12),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX: Joi.number().default(100),
  AUTH_RATE_LIMIT_MAX: Joi.number().default(10),

  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  LOG_FILE: Joi.string().default('logs/app.log'),

  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().optional(),

  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),

  SENTRY_DSN: Joi.string().uri().optional(),
}).unknown(true);

function validateEnv() {
  const { error, value } = envSchema.validate(process.env, { abortEarly: false });
  if (error) {
    const missing = error.details.map((d) => d.message).join('\n');
    throw new Error(`Environment validation failed:\n${missing}`);
  }
  return value;
}

module.exports = { validateEnv };
