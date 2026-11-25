const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const authService = require('../src/services/auth.service');
const { User } = require('../src/models/User.model');

describe('US-07 — CRUD Comptes du Personnel (Admin only) & Activation/Désactivation', () => {
  const adminId = new mongoose.Types.ObjectId();
  const medecinId = new mongoose.Types.ObjectId();

  const adminToken = authService.generateToken({
    _id: adminId,
    email: 'admin@meditrack.ma',
    role: 'admin'
  });

  const medecinToken = authService.generateToken({
    _id: medecinId,
    email: 'doc@meditrack.ma',
    role: 'medecin'
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects unauthenticated access to GET /api/users with 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  it('rejects non-admin user access to GET /api/users with 403', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${medecinToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('allows admin to list staff users with pagination (GET /api/users)', async () => {
    const fakeUsers = [
      new User({
        _id: medecinId,
        firstName: 'Karim',
        lastName: 'Benali',
        email: 'karim@meditrack.ma',
        password: 'HashedPassword@1',
        role: 'medecin',
        specialite: 'Cardiologie',
        isActive: true
      })
    ];

    jest.spyOn(User, 'find').mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(fakeUsers)
        })
      })
    });
    jest.spyOn(User, 'countDocuments').mockResolvedValue(1);

    const res = await request(app)
      .get('/api/users?role=medecin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.users).toHaveLength(1);
    expect(res.body.data.users[0].role).toBe('medecin');
    expect(res.body.data.users[0].password).toBeUndefined();
    expect(res.body.data.pagination.total).toBe(1);
  });

  it('allows admin to create a new staff account (POST /api/users -> 201)', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'create').mockImplementation(async (doc) => new User(doc));

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Salma',
        lastName: 'Tazi',
        email: 'salma.pharma@meditrack.ma',
        password: 'StrongPass@2026',
        role: 'pharmacien',
        phone: '+212600112233'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.role).toBe('pharmacien');
    expect(res.body.data.user.isActive).toBe(true);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('returns 409 when creating a staff user with duplicate email', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ _id: medecinId });

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Salma',
        lastName: 'Tazi',
        email: 'existing@meditrack.ma',
        password: 'StrongPass@2026',
        role: 'infirmier'
      });

    expect(res.statusCode).toBe(409);
  });

  it('allows admin to deactivate and reactivate a staff account (PATCH /api/users/:id/status)', async () => {
    const targetUser = new User({
      _id: medecinId,
      firstName: 'Karim',
      lastName: 'Benali',
      email: 'karim@meditrack.ma',
      password: 'HashedPassword@1',
      role: 'medecin',
      isActive: true
    });
    targetUser.save = jest.fn().mockResolvedValue(targetUser);

    jest.spyOn(User, 'findById').mockResolvedValue(targetUser);

    const res = await request(app)
      .patch(`/api/users/${medecinId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.isActive).toBe(false);
    expect(targetUser.save).toHaveBeenCalledTimes(1);
  });

  it('prevents an admin from deactivating their own account (400)', async () => {
    const res = await request(app)
      .patch(`/api/users/${adminId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(res.statusCode).toBe(400);
  });
});
