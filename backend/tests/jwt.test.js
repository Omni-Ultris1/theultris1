const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../src/utils/jwt');

// Set required env vars
process.env.JWT_SECRET = 'test-jwt-secret-key-at-least-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-at-least-32-characters-long';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

describe('JWT Utilities', () => {
  const payload = { userId: '507f1f77bcf86cd799439011', role: 'user', tier: 'free' };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(payload);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(payload);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and decode a valid access token', () => {
      const token = generateAccessToken(payload);
      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.tier).toBe(payload.tier);
    });

    it('should throw on invalid token', () => {
      expect(() => verifyAccessToken('invalid.token.here')).toThrow();
    });

    it('should throw on token signed with wrong secret', () => {
      const { sign } = require('jsonwebtoken');
      const badToken = sign(payload, 'wrong-secret-key-that-is-not-correct-abc');
      expect(() => verifyAccessToken(badToken)).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and decode a valid refresh token', () => {
      const token = generateRefreshToken(payload);
      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(payload.userId);
    });

    it('should throw on invalid refresh token', () => {
      expect(() => verifyRefreshToken('bad.token')).toThrow();
    });
  });
});
