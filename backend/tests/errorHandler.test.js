const { AppError, errorHandler, notFound } = require('../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { originalUrl: '/test', method: 'GET', ip: '127.0.0.1' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('AppError', () => {
    it('should create an error with message and statusCode', () => {
      const err = new AppError('Not found', 404);
      expect(err.message).toBe('Not found');
      expect(err.statusCode).toBe(404);
      expect(err.isOperational).toBe(true);
    });
  });

  describe('notFound middleware', () => {
    it('should call next with 404 AppError', () => {
      notFound(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });
  });

  describe('errorHandler middleware', () => {
    it('should return 500 for generic errors', () => {
      process.env.NODE_ENV = 'test';
      const err = new Error('Something went wrong');
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should return correct status for AppError', () => {
      const err = new AppError('Forbidden', 403);
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Forbidden' }));
    });

    it('should handle Mongoose duplicate key error', () => {
      const err = { code: 11000, keyValue: { email: 'test@test.com' } };
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('should handle Mongoose CastError', () => {
      const err = { name: 'CastError', path: '_id', message: 'Cast failed' };
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
