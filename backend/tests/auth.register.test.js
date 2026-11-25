const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/server');
const { User, ROLES } = require('../src/models/User.model');

describe('US-03 — Modèle User & Endpoint POST /api/auth/register', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('User Mongoose Model (US-03-T1)', () => {
    it('exports all 5 expected MediTrack roles', () => {
      expect(ROLES).toEqual(['admin', 'medecin', 'infirmier', 'patient', 'pharmacien']);
    });

    it('validates a correct patient user document', async () => {
      const user = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'Rida.Patient@MediTrack.ma',
        password: 'Password@123',
        phone: '+212600000001'
      });

      await expect(user.validate()).resolves.toBeUndefined();
      expect(user.email).toBe('rida.patient@meditrack.ma');
      expect(user.role).toBe('patient');
      expect(user.isActive).toBe(true);
      expect(user.twoFactorEnabled).toBe(false);
    });

    it('rejects invalid email and unknown role on schema validation', async () => {
      const invalidUser = new User({
        firstName: 'A',
        lastName: 'B',
        email: 'invalid-email',
        password: 'short',
        role: 'superadmin'
      });

      await expect(invalidUser.validate()).rejects.toThrow();
    });

    it('hashes password with bcrypt in pre-save hook and verifies via comparePassword', async () => {
      const user = new User({
        firstName: 'Rida',
        lastName: 'Dandane',
        email: 'hash.test@meditrack.ma',
        password: 'Password@123'
      });

      // Invoke Mongoose pre('save') hook directly without requiring a live MongoDB instance
      const preSaveHooks = User.schema.s.hooks._pres.get('save') || [];
      const hashHook = preSaveHooks.find((h) => h.fn.name === 'hashPasswordBeforeSave');
      expect(hashHook).toBeDefined();

      await hashHook.fn.call(user);

      expect(user.password).not.toBe('Password@123');
      expect(user.password.startsWith('$2')).toBe(true);
      await expect(user.comparePassword('Password@123')).resolves.toBe(true);
      await expect(user.comparePassword('WrongPass@123')).resolves.toBe(false);
      await expect(user.comparePassword('')).resolves.toBe(false);

      // Should not re-hash when password was not modified
      const existingHash = user.password;
      jest.spyOn(user, 'isModified').mockReturnValue(false);
      await hashHook.fn.call(user);
      expect(user.password).toBe(existingHash);
    });

    it('strips password and twoFactorSecret when serialized to JSON', () => {
      const user = new User({
        firstName: 'Sara',
        lastName: 'Benali',
        email: 'sara@meditrack.ma',
        password: 'Password@123',
        twoFactorSecret: 'SECRET_BASE32'
      });

      const json = user.toJSON();
      expect(json.password).toBeUndefined();
      expect(json.twoFactorSecret).toBeUndefined();
      expect(json.email).toBe('sara@meditrack.ma');
    });
  });

  describe('POST /api/auth/register (US-03-T2 & US-03-T4)', () => {
    const validPayload = {
      firstName: 'Amine',
      lastName: 'El Idrissi',
      email: 'amine.elidrissi@meditrack.ma',
      password: 'StrongPass@2026',
      phone: '+212612345678'
    };

    it('creates a patient account and returns 201 without exposing password', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'create').mockImplementation(async (doc) => {
        const hashedPassword = await bcrypt.hash(doc.password, 10);
        return new User({ ...doc, password: hashedPassword });
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validPayload, role: 'admin' }); // Attempted privilege escalation

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe('amine.elidrissi@meditrack.ma');
      expect(res.body.data.user.role).toBe('patient'); // Must enforce patient role
      expect(res.body.data.user.password).toBeUndefined();
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'amine.elidrissi@meditrack.ma',
          role: 'patient'
        })
      );
    });

    it('returns 409 Conflict if email is already registered', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'existing-id', email: validPayload.email });

      const res = await request(app).post('/api/auth/register').send(validPayload);

      expect(res.statusCode).toBe(409);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toMatch(/existe déjà/i);
    });

    it('returns 400 Bad Request for weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validPayload, password: 'weakpassword' });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.details.join(' ')).toMatch(/mot de passe/i);
    });

    it('returns 400 Bad Request for invalid email or missing names', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ firstName: 'A', lastName: '', email: 'not-an-email', password: 'StrongPass@2026' });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.length).toBeGreaterThanOrEqual(3);
    });
  });
});
