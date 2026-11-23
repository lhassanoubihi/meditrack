const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const env = require('../src/config/env');
const { User } = require('../src/models/User.model');

describe('US-04 — POST /api/auth/login (JWT) & Middleware authenticate (401)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockFindOneWithSelect = (userDoc) => {
    jest.spyOn(User, 'findOne').mockReturnValue({
      select: jest.fn().mockResolvedValue(userDoc)
    });
  };

  describe('POST /api/auth/login (US-04-T1)', () => {
    it('authenticates a valid user and returns a signed JWT + sanitized user', async () => {
      const hashedPassword = await bcrypt.hash('StrongPass@2026', 10);
      const userDoc = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'rida.medecin@meditrack.ma',
        password: hashedPassword,
        role: 'medecin',
        isActive: true
      });

      mockFindOneWithSelect(userDoc);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'Rida.Medecin@MediTrack.ma', password: 'StrongPass@2026' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('rida.medecin@meditrack.ma');
      expect(res.body.data.user.role).toBe('medecin');
      expect(res.body.data.user.password).toBeUndefined();

      const decoded = jwt.verify(res.body.data.token, env.jwtSecret);
      expect(decoded.sub).toBe(String(userDoc._id));
      expect(decoded.email).toBe('rida.medecin@meditrack.ma');
      expect(decoded.role).toBe('medecin');
    });

    it('returns 400 when email or password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'rida@meditrack.ma' });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('returns 401 when user does not exist', async () => {
      mockFindOneWithSelect(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'inconnu@meditrack.ma', password: 'StrongPass@2026' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/incorrect/i);
    });

    it('returns 401 when password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('StrongPass@2026', 10);
      const userDoc = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'rida@meditrack.ma',
        password: hashedPassword,
        role: 'patient',
        isActive: true
      });
      mockFindOneWithSelect(userDoc);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'rida@meditrack.ma', password: 'WrongPassword@1' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/incorrect/i);
    });

    it('returns 403 when user account is deactivated', async () => {
      const hashedPassword = await bcrypt.hash('StrongPass@2026', 10);
      const inactiveUser = new User({
        firstName: 'Compte',
        lastName: 'Desactive',
        email: 'disabled@meditrack.ma',
        password: hashedPassword,
        role: 'infirmier',
        isActive: false
      });
      mockFindOneWithSelect(inactiveUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'disabled@meditrack.ma', password: 'StrongPass@2026' });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/désactivé/i);
    });
  });

  describe('Middleware authenticate & GET /api/auth/me (US-04-T2)', () => {
    it('allows access with a valid Bearer JWT', async () => {
      const token = jwt.sign(
        { sub: '507f1f77bcf86cd799439011', email: 'dr.rida@meditrack.ma', role: 'medecin' },
        env.jwtSecret,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toEqual({
        id: '507f1f77bcf86cd799439011',
        email: 'dr.rida@meditrack.ma',
        role: 'medecin'
      });
    });

    it('returns 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/manquant/i);
    });

    it('returns 401 when Authorization header is not Bearer or empty', async () => {
      const resBasic = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Basic abc123');
      expect(resBasic.statusCode).toBe(401);

      const resEmpty = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer ');
      expect(resEmpty.statusCode).toBe(401);
    });

    it('returns 401 when JWT signature is invalid', async () => {
      const forgedToken = jwt.sign(
        { sub: '123', email: 'hacker@meditrack.ma', role: 'admin' },
        'wrong-secret-key',
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${forgedToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalide/i);
    });

    it('returns 401 when JWT token is expired', async () => {
      const expiredToken = jwt.sign(
        { sub: '123', email: 'expired@meditrack.ma', role: 'patient' },
        env.jwtSecret,
        { expiresIn: '-10s' }
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/expiré/i);
    });
  });
});
