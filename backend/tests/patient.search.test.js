const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/server');
const env = require('../src/config/env');
const { Patient } = require('../src/models/Patient.model');

const signToken = (role = 'medecin', sub = '507f1f77bcf86cd799439011') =>
  jwt.sign({ sub, email: `${role}@meditrack.ma`, role }, env.jwtSecret, { expiresIn: '1h' });

const mockFindChain = (docs) => ({
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue(docs)
});

describe('US-09 — Recherche, pagination et consultation du dossier patient (GET /api/patients)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 401 when unauthenticated and 403 for patient or pharmacien roles', async () => {
    const unauthRes = await request(app).get('/api/patients');
    expect(unauthRes.statusCode).toBe(401);

    for (const forbiddenRole of ['patient', 'pharmacien']) {
      const res = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${signToken(forbiddenRole)}`);
      expect(res.statusCode).toBe(403);
    }
  });

  it('lists non-archived patients with default pagination for medecin/admin/infirmier', async () => {
    const samplePatient = new Patient({
      firstName: 'Youssef',
      lastName: 'El Amrani',
      cin: 'AB123456',
      dateOfBirth: new Date('1992-05-14'),
      gender: 'M',
      bloodGroup: 'O+',
      contact: { phone: '0612345678', email: 'youssef@example.ma' },
      antecedents: ['Asthme'],
      allergies: ['Pollen'],
      traitements: ['Ventoline'],
      isArchived: false
    });

    const chain = mockFindChain([samplePatient]);
    const findSpy = jest.spyOn(Patient, 'find').mockReturnValue(chain);
    jest.spyOn(Patient, 'countDocuments').mockResolvedValue(1);

    const res = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${signToken('medecin')}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.patients).toHaveLength(1);
    expect(res.body.data.patients[0].cin).toBe('AB123456');
    expect(res.body.data.pagination).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    });
    expect(findSpy).toHaveBeenCalledWith({ isArchived: { $ne: true } });
    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(10);
  });

  it('applies case-insensitive search on firstName, lastName and CIN with custom pagination', async () => {
    const chain = mockFindChain([]);
    const findSpy = jest.spyOn(Patient, 'find').mockReturnValue(chain);
    jest.spyOn(Patient, 'countDocuments').mockResolvedValue(25);

    const res = await request(app)
      .get('/api/patients?search=CD987&page=2&limit=5')
      .set('Authorization', `Bearer ${signToken('admin')}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.pagination).toEqual({
      total: 25,
      page: 2,
      limit: 5,
      totalPages: 5
    });

    const calledFilter = findSpy.mock.calls[0][0];
    expect(calledFilter.isArchived).toEqual({ $ne: true });
    expect(calledFilter.$or).toHaveLength(3);
    expect(calledFilter.$or[0].firstName).toBeInstanceOf(RegExp);
    expect(calledFilter.$or[2].cin.test('cd98765')).toBe(true);
    expect(chain.skip).toHaveBeenCalledWith(5);
    expect(chain.limit).toHaveBeenCalledWith(5);
  });

  it('includes archived patients when includeArchived=true is passed', async () => {
    const chain = mockFindChain([]);
    const findSpy = jest.spyOn(Patient, 'find').mockReturnValue(chain);
    jest.spyOn(Patient, 'countDocuments').mockResolvedValue(0);

    const res = await request(app)
      .get('/api/patients?includeArchived=true')
      .set('Authorization', `Bearer ${signToken('infirmier')}`);

    expect(res.statusCode).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({});
    expect(res.body.data.pagination.totalPages).toBe(1);
  });
});
