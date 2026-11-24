const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/server');
const env = require('../src/config/env');
const { authenticate, authorize } = require('../src/middlewares/auth.middleware');
const { errorHandler } = require('../src/middlewares/errorHandler.middleware');
const { User, ROLES } = require('../src/models/User.model');

const signToken = (role, sub = '507f1f77bcf86cd799439011') =>
  jwt.sign({ sub, email: `${role}@meditrack.ma`, role }, env.jwtSecret, { expiresIn: '1h' });

describe('US-05 — Middleware RBAC authorize(...roles) & Tests accès autorisés/interdits (T1, T4)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const buildRbacApp = () => {
    const testApp = express();
    testApp.get('/admin-only', authenticate, authorize('admin'), (req, res) =>
      res.status(200).json({ ok: true, role: req.user.role })
    );
    testApp.get('/clinical', authenticate, authorize('medecin', 'infirmier'), (req, res) =>
      res.status(200).json({ ok: true, role: req.user.role })
    );
    testApp.get('/pharmacy', authenticate, authorize(['admin', 'pharmacien']), (req, res) =>
      res.status(200).json({ ok: true, role: req.user.role })
    );
    testApp.get('/no-auth-context', authorize('admin'), (req, res) =>
      res.status(200).json({ ok: true })
    );
    testApp.get('/empty-roles', authenticate, authorize(), (req, res) =>
      res.status(200).json({ ok: true })
    );
    testApp.use(errorHandler);
    return testApp;
  };

  describe('authorize(...roles) unit & matrix checks', () => {
    const rbacApp = buildRbacApp();

    it('allows admin on admin-only route and returns 403 for all other 4 roles', async () => {
      const adminRes = await request(rbacApp)
        .get('/admin-only')
        .set('Authorization', `Bearer ${signToken('admin')}`);
      expect(adminRes.statusCode).toBe(200);
      expect(adminRes.body.role).toBe('admin');

      for (const forbiddenRole of ['medecin', 'infirmier', 'patient', 'pharmacien']) {
        const res = await request(rbacApp)
          .get('/admin-only')
          .set('Authorization', `Bearer ${signToken(forbiddenRole)}`);
        expect(res.statusCode).toBe(403);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toMatch(/Accès refusé/i);
      }
    });

    it('allows medecin and infirmier on clinical route and forbids admin, patient and pharmacien', async () => {
      for (const allowedRole of ['medecin', 'infirmier']) {
        const res = await request(rbacApp)
          .get('/clinical')
          .set('Authorization', `Bearer ${signToken(allowedRole)}`);
        expect(res.statusCode).toBe(200);
      }

      for (const forbiddenRole of ['admin', 'patient', 'pharmacien']) {
        const res = await request(rbacApp)
          .get('/clinical')
          .set('Authorization', `Bearer ${signToken(forbiddenRole)}`);
        expect(res.statusCode).toBe(403);
      }
    });

    it('supports array arguments and case-insensitive role matching', async () => {
      const pharmaRes = await request(rbacApp)
        .get('/pharmacy')
        .set('Authorization', `Bearer ${signToken('PHARMACIEN')}`);
      expect(pharmaRes.statusCode).toBe(200);

      const patientRes = await request(rbacApp)
        .get('/pharmacy')
        .set('Authorization', `Bearer ${signToken('patient')}`);
      expect(patientRes.statusCode).toBe(403);
    });

    it('returns 401 if authorize is called without req.user context', async () => {
      const res = await request(rbacApp).get('/no-auth-context');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/Authentification requise/i);
    });

    it('returns 403 when authorize() is configured with no allowed roles', async () => {
      const res = await request(rbacApp)
        .get('/empty-roles')
        .set('Authorization', `Bearer ${signToken('admin')}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('Integration with /api/users (Admin RBAC protection)', () => {
    it('forbids non-admin roles on GET /api/users with 403 and allows admin', async () => {
      const nonAdminRoles = ROLES.filter((r) => r !== 'admin');
      for (const role of nonAdminRoles) {
        const res = await request(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${signToken(role)}`);
        expect(res.statusCode).toBe(403);
      }

      const chain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };
      jest.spyOn(User, 'find').mockReturnValue(chain);
      jest.spyOn(User, 'countDocuments').mockResolvedValue(0);

      const adminRes = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${signToken('admin')}`);
      expect(adminRes.statusCode).toBe(200);
      expect(adminRes.body.status).toBe('success');
    });
  });
});
