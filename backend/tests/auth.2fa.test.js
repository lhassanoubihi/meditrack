const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');

const app = require('../src/server');
const env = require('../src/config/env');
const { User } = require('../src/models/User.model');
const twoFactorService = require('../src/services/twoFactor.service');

const signAccessToken = (userId, role = 'medecin', email = 'dr.rida@meditrack.ma') =>
  jwt.sign({ sub: String(userId), email, role }, env.jwtSecret, { expiresIn: '1h' });

describe('US-06 — Double Authentification (2FA TOTP) — Endpoints, Erreurs & Tests unitaires (T1-T5)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockFindByIdWithSelect = (userDoc) => {
    jest.spyOn(User, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValue(userDoc)
    });
  };

  describe('POST /api/auth/2fa/setup (US-06-T1)', () => {
    it('generates a Base32 TOTP secret, otpauthUrl and PNG QR code DataURL', async () => {
      const userDoc = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'rida.2fa@meditrack.ma',
        password: 'HashedPassword@123',
        role: 'medecin'
      });
      userDoc.save = jest.fn().mockResolvedValue(userDoc);

      jest.spyOn(User, 'findById').mockResolvedValue(userDoc);

      const res = await request(app)
        .post('/api/auth/2fa/setup')
        .set('Authorization', `Bearer ${signAccessToken(userDoc._id, 'medecin', userDoc.email)}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.secret).toBeDefined();
      expect(res.body.data.otpauthUrl).toContain('otpauth://totp/');
      expect(res.body.data.qrCodeDataUrl).toMatch(/^data:image\/png;base64,/);
      expect(userDoc.twoFactorSecret).toBe(res.body.data.secret);
      expect(userDoc.twoFactorEnabled).toBe(false);
      expect(userDoc.save).toHaveBeenCalledTimes(1);
    });

    it('returns 401 when unauthenticated and 404 when user is not found', async () => {
      const unauthRes = await request(app).post('/api/auth/2fa/setup');
      expect(unauthRes.statusCode).toBe(401);

      jest.spyOn(User, 'findById').mockResolvedValue(null);
      const notFoundRes = await request(app)
        .post('/api/auth/2fa/setup')
        .set('Authorization', `Bearer ${signAccessToken('507f1f77bcf86cd799439011')}`);
      expect(notFoundRes.statusCode).toBe(404);
    });
  });

  describe('POST /api/auth/2fa/enable & disable (US-06-T1 & US-06-T4)', () => {
    it('enables 2FA when a valid 6-digit TOTP code is provided', async () => {
      const secret = speakeasy.generateSecret({ length: 20 });
      const validCode = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

      const userDoc = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'rida.enable@meditrack.ma',
        password: 'HashedPassword@123',
        role: 'admin',
        twoFactorEnabled: false,
        twoFactorSecret: secret.base32
      });
      userDoc.save = jest.fn().mockResolvedValue(userDoc);
      mockFindByIdWithSelect(userDoc);

      const res = await request(app)
        .post('/api/auth/2fa/enable')
        .set('Authorization', `Bearer ${signAccessToken(userDoc._id, 'admin', userDoc.email)}`)
        .send({ code: validCode });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.twoFactorEnabled).toBe(true);
      expect(res.body.data.user.twoFactorSecret).toBeUndefined();
      expect(userDoc.twoFactorEnabled).toBe(true);
    });

    it('rejects enable with 400 when code is missing or setup was not run, and 401 on invalid/expired TOTP', async () => {
      const token = signAccessToken('507f1f77bcf86cd799439011', 'medecin');

      const missingCodeRes = await request(app)
        .post('/api/auth/2fa/enable')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(missingCodeRes.statusCode).toBe(400);

      const userNoSecret = new User({
        firstName: 'No',
        lastName: 'Secret',
        email: 'nosecret@meditrack.ma',
        password: 'HashedPassword@123'
      });
      mockFindByIdWithSelect(userNoSecret);
      const noSecretRes = await request(app)
        .post('/api/auth/2fa/enable')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: '123456' });
      expect(noSecretRes.statusCode).toBe(400);

      const secret = speakeasy.generateSecret({ length: 20 });
      const expiredCode = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        time: Math.floor(Date.now() / 1000) - 300
      });
      const userWithSecret = new User({
        firstName: 'With',
        lastName: 'Secret',
        email: 'withsecret@meditrack.ma',
        password: 'HashedPassword@123',
        twoFactorSecret: secret.base32
      });
      mockFindByIdWithSelect(userWithSecret);

      const expiredRes = await request(app)
        .post('/api/auth/2fa/enable')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: expiredCode });
      expect(expiredRes.statusCode).toBe(401);
      expect(expiredRes.body.message).toMatch(/invalide ou expiré/i);
    });

    it('disables 2FA with valid TOTP and rejects invalid code or already-disabled account', async () => {
      const secret = speakeasy.generateSecret({ length: 20 });
      const validCode = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
      const userDoc = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'rida.disable@meditrack.ma',
        password: 'HashedPassword@123',
        role: 'medecin',
        twoFactorEnabled: true,
        twoFactorSecret: secret.base32
      });
      userDoc.save = jest.fn().mockResolvedValue(userDoc);
      const token = signAccessToken(userDoc._id, 'medecin', userDoc.email);

      const missingRes = await request(app)
        .post('/api/auth/2fa/disable')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(missingRes.statusCode).toBe(400);

      mockFindByIdWithSelect(userDoc);
      const badCodeRes = await request(app)
        .post('/api/auth/2fa/disable')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: '000000' });
      expect(badCodeRes.statusCode).toBe(401);

      mockFindByIdWithSelect(userDoc);
      const okRes = await request(app)
        .post('/api/auth/2fa/disable')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: validCode });
      expect(okRes.statusCode).toBe(200);
      expect(okRes.body.data.user.twoFactorEnabled).toBe(false);
      expect(userDoc.twoFactorSecret).toBeNull();

      mockFindByIdWithSelect(userDoc);
      const alreadyDisabledRes = await request(app)
        .post('/api/auth/2fa/disable')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: validCode });
      expect(alreadyDisabledRes.statusCode).toBe(400);
    });
  });

  describe('2FA Login Challenge & POST /api/auth/2fa/verify (US-06-T2, T4, T5)', () => {
    it('returns requiresTwoFactor + tempToken on login, blocks tempToken on /me, and issues final JWT on /2fa/verify', async () => {
      const secret = speakeasy.generateSecret({ length: 20 });
      const hashedPassword = await bcrypt.hash('StrongPass@2026', 10);
      const userDoc = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'rida.totp@meditrack.ma',
        password: hashedPassword,
        role: 'medecin',
        isActive: true,
        twoFactorEnabled: true,
        twoFactorSecret: secret.base32
      });

      jest.spyOn(User, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(userDoc)
      });

      // Step 1: Login returns tempToken only (not final JWT)
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'rida.totp@meditrack.ma', password: 'StrongPass@2026' });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body.data.requiresTwoFactor).toBe(true);
      expect(loginRes.body.data.tempToken).toBeDefined();
      expect(loginRes.body.data.token).toBeUndefined();

      const tempToken = loginRes.body.data.tempToken;

      // Step 2: tempToken MUST NOT grant access to protected endpoints
      const bypassAttempt = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tempToken}`);
      expect(bypassAttempt.statusCode).toBe(401);
      expect(bypassAttempt.body.message).toMatch(/Validation 2FA requise/i);

      // Step 3: Verify 2FA with valid TOTP code issues final access JWT
      const validCode = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
      mockFindByIdWithSelect(userDoc);

      const verifyRes = await request(app)
        .post('/api/auth/2fa/verify')
        .send({ tempToken, code: validCode });

      expect(verifyRes.statusCode).toBe(200);
      expect(verifyRes.body.data.token).toBeDefined();
      expect(verifyRes.body.data.user.email).toBe('rida.totp@meditrack.ma');
      expect(verifyRes.body.data.user.twoFactorSecret).toBeUndefined();

      // Step 4: Final JWT works on GET /api/auth/me
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${verifyRes.body.data.token}`);
      expect(meRes.statusCode).toBe(200);
      expect(meRes.body.data.user.role).toBe('medecin');
    });

    it('supports tempToken via Authorization Bearer header', async () => {
      const secret = speakeasy.generateSecret({ length: 20 });
      const userDoc = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'bearer.2fa@meditrack.ma',
        password: 'HashedPassword@123',
        role: 'patient',
        isActive: true,
        twoFactorEnabled: true,
        twoFactorSecret: secret.base32
      });
      const tempToken = twoFactorService.generateTempTwoFactorToken(userDoc);
      const validCode = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
      mockFindByIdWithSelect(userDoc);

      const res = await request(app)
        .post('/api/auth/2fa/verify')
        .set('Authorization', `Bearer ${tempToken}`)
        .send({ code: validCode });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('rejects missing code (400), missing/forged/expired tempToken (401), wrong purpose token (401), invalid TOTP (401), and inactive user (401)', async () => {
      const secret = speakeasy.generateSecret({ length: 20 });
      const userDoc = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'err.2fa@meditrack.ma',
        password: 'HashedPassword@123',
        role: 'medecin',
        isActive: true,
        twoFactorEnabled: true,
        twoFactorSecret: secret.base32
      });
      const tempToken = twoFactorService.generateTempTwoFactorToken(userDoc);

      // Missing code -> 400
      const noCodeRes = await request(app).post('/api/auth/2fa/verify').send({ tempToken });
      expect(noCodeRes.statusCode).toBe(400);

      // Missing tempToken -> 401
      const noTempRes = await request(app).post('/api/auth/2fa/verify').send({ code: '123456' });
      expect(noTempRes.statusCode).toBe(401);

      // Forged tempToken -> 401
      const forgedRes = await request(app)
        .post('/api/auth/2fa/verify')
        .send({ tempToken: 'invalid.jwt.token', code: '123456' });
      expect(forgedRes.statusCode).toBe(401);

      // Regular access token (wrong purpose) -> 401
      const wrongPurposeToken = signAccessToken(userDoc._id, 'medecin');
      const wrongPurposeRes = await request(app)
        .post('/api/auth/2fa/verify')
        .send({ tempToken: wrongPurposeToken, code: '123456' });
      expect(wrongPurposeRes.statusCode).toBe(401);

      // Expired tempToken -> 401
      const expiredTempToken = jwt.sign(
        { sub: String(userDoc._id), email: userDoc.email, role: userDoc.role, purpose: '2fa_pending' },
        env.jwtSecret,
        { expiresIn: '-5s' }
      );
      const expiredTempRes = await request(app)
        .post('/api/auth/2fa/verify')
        .send({ tempToken: expiredTempToken, code: '123456' });
      expect(expiredTempRes.statusCode).toBe(401);
      expect(expiredTempRes.body.message).toMatch(/Session 2FA expirée/i);

      // Invalid 6-digit TOTP -> 401
      mockFindByIdWithSelect(userDoc);
      const badOtpRes = await request(app)
        .post('/api/auth/2fa/verify')
        .send({ tempToken, code: 'abc123' });
      expect(badOtpRes.statusCode).toBe(401);
      expect(badOtpRes.body.message).toMatch(/invalide ou expiré/i);

      // Inactive user -> 401
      const disabledUser = new User({
        firstName: 'Off',
        lastName: 'User',
        email: 'off@meditrack.ma',
        password: 'HashedPassword@123',
        isActive: false,
        twoFactorEnabled: true,
        twoFactorSecret: secret.base32
      });
      mockFindByIdWithSelect(disabledUser);
      const inactiveRes = await request(app)
        .post('/api/auth/2fa/verify')
        .send({ tempToken, code: '123456' });
      expect(inactiveRes.statusCode).toBe(401);
    });
  });
});
