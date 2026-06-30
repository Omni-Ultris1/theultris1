const request = require('supertest');

// Mock mongoose before requiring app
jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  mongoose.connect = jest.fn().mockResolvedValue({ connection: { host: 'test' } });
  return mongoose;
});

// Mock the logger to suppress output during tests
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

// Set test env vars
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/ultris1_test';
process.env.JWT_SECRET = 'test-jwt-secret-key-at-least-32-chars-long';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-at-least-32-chars-long';
process.env.BCRYPT_ROUNDS = '10';

module.exports = { request };
