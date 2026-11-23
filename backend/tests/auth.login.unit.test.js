const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../src/server');
const env = require('../src/config/env');
const authService = require('../src/services/auth.service');
const { User } = require('../src/models/User.model');

describe('US-04-T4 — Tests unitaires complémentaires login & JWT (Lhassan Oubihi)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sanitizeUser removes password, twoFactorSecret and __v fields', () => {
    const clean = authService.sanitizeUser({
      _id: '507f1f77bcf86cd799439011',
      email: 'lhassan@meditrack.ma',
      role: 'admin',
      password: 'hashed_secret_password',
      twoFactorSecret: 'JBSWY3DPEHPK3PXP',
      __v: 0
    });

    expect(clean.email).toBe('lhassan@meditrack.ma');
    expect(clean.role).toBe('admin');
    expect(clean.password).toBeUndefined();
    expect(clean.twoFactorSecret).toBeUndefined();
    expect(clean.__v).toBeUndefined();
  });

  it('generateToken encodes sub, email and role verifiable with env.jwtSecret', () => {
    const token = authService.generateToken({
      _id: '507f1f77bcf86cd799439012',
      email: 'doc@meditrack.ma',
      role: 'medecin'
    });

    const decoded = jwt.verify(token, env.jwtSecret);
    expect(decoded.sub).toBe('507f1f77bcf86cd799439012');
    expect(decoded.email).toBe('doc@meditrack.ma');
    expect(decoded.role).toBe('medecin');
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });

  it('loginUser trims and lowercases email before querying User collection', async () => {
    const hashedPassword = await bcrypt.hash('ValidPass@2026', 10);
    const userDoc = new User({
      firstName: 'Lhassan',
      lastName: 'Oubihi',
      email: 'lhassan@meditrack.ma',
      password: hashedPassword,
      role: 'patient',
      isActive: true
    });

    const selectMock = jest.fn().mockResolvedValue(userDoc);
    const findOneSpy = jest.spyOn(User, 'findOne').mockReturnValue({ select: selectMock });

    const result = await authService.loginUser({
      email: '  LHASSAN@MediTrack.ma  ',
      password: 'ValidPass@2026'
    });

    expect(findOneSpy).toHaveBeenCalledWith({ email: 'lhassan@meditrack.ma' });
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('lhassan@meditrack.ma');
    expect(result.user.password).toBeUndefined();
  });

  it('GET /api/auth/me rejects malformed Authorization header without Bearer prefix (401)', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Token invalid_prefix_token');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });

  it('GET /api/auth/me rejects expired JWT with 401', async () => {
    const expiredToken = jwt.sign(
      { sub: '507f1f77bcf86cd799439013', email: 'old@meditrack.ma', role: 'patient' },
      env.jwtSecret,
      { expiresIn: -10 }
    );

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });
});
