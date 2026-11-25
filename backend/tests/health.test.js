const request = require('supertest');
const express = require('express');
const app = require('../src/server');
const { AppError, errorHandler } = require('../src/middlewares/errorHandler.middleware');
const { getDatabaseStatus } = require('../src/config/database');
const models = require('../src/models');

describe('Health Check & Core Backend Architecture (US-01-T1)', () => {
  it('GET /api/health should return 200 OK with service metadata', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('MediTrack API');
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');
    expect(res.body.database).toBeDefined();
  });

  it('should return 404 JSON for unknown API routes', async () => {
    const res = await request(app).get('/api/route-inexistante');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('/api/route-inexistante');
  });

  it('getDatabaseStatus should return a valid connection state string', () => {
    expect(['disconnected', 'connected', 'connecting', 'disconnecting']).toContain(
      getDatabaseStatus()
    );
  });

  it('models registry should export an object', () => {
    expect(typeof models).toBe('object');
  });

  describe('Centralized Error Handler Middleware', () => {
    const buildTestApp = (errToThrow) => {
      const testApp = express();
      testApp.get('/boom', (req, res, next) => next(errToThrow));
      testApp.use(errorHandler);
      return testApp;
    };

    it('handles custom AppError with statusCode and details', async () => {
      const testApp = buildTestApp(new AppError('Accès refusé', 403, { role: 'patient' }));
      const res = await request(testApp).get('/boom');

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Accès refusé',
        details: { role: 'patient' }
      });
    });

    it('handles Mongoose ValidationError as 400', async () => {
      const validationErr = {
        name: 'ValidationError',
        errors: { email: { message: 'Email requis' } }
      };
      const res = await request(buildTestApp(validationErr)).get('/boom');

      expect(res.statusCode).toBe(400);
      expect(res.body.details).toContain('Email requis');
    });

    it('handles Mongoose CastError as 400', async () => {
      const castErr = { name: 'CastError', path: '_id' };
      const res = await request(buildTestApp(castErr)).get('/boom');

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('_id');
    });

    it('handles Mongo duplicate key error (11000) as 409', async () => {
      const dupErr = { code: 11000, keyValue: { email: 'a@b.com' } };
      const res = await request(buildTestApp(dupErr)).get('/boom');

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toContain('email');
    });

    it('handles JWT errors as 401', async () => {
      const jwtErr = { name: 'TokenExpiredError' };
      const res = await request(buildTestApp(jwtErr)).get('/boom');

      expect(res.statusCode).toBe(401);
    });

    it('defaults to 500 for unexpected errors', async () => {
      const res = await request(buildTestApp(new Error('Boom'))).get('/boom');

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Boom');
    });
  });
});
