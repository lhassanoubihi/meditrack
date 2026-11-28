const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/server');
const env = require('../src/config/env');
const { Patient } = require('../src/models/Patient.model');

const PATIENT_USER_ID = '507f1f77bcf86cd799439033';

const signToken = (role = 'patient', sub = PATIENT_USER_ID, email = 'amine.patient@meditrack.ma') =>
  jwt.sign({ sub, email, role }, env.jwtSecret, { expiresIn: '1h' });

describe('US-12 — Consultation de son propre dossier (GET /api/patients/me)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 401 when unauthenticated and 403 for non-patient roles', async () => {
    const unauth = await request(app).get('/api/patients/me');
    expect(unauth.statusCode).toBe(401);

    for (const nonPatientRole of ['admin', 'medecin', 'infirmier', 'pharmacien']) {
      const res = await request(app)
        .get('/api/patients/me')
        .set('Authorization', `Bearer ${signToken(nonPatientRole)}`);
      expect(res.statusCode).toBe(403);
    }
  });

  it('returns 200 with the connected patient dossier matched by userId', async () => {
    const doc = new Patient({
      userId: PATIENT_USER_ID,
      firstName: 'Amine',
      lastName: 'Chraibi',
      cin: 'EF112233',
      dateOfBirth: new Date('1995-03-22'),
      gender: 'M',
      bloodGroup: 'A+',
      contact: { phone: '0612345678', email: 'amine.patient@meditrack.ma' },
      antecedents: ['Diabète type 1'],
      allergies: ['Pénicilline'],
      traitements: ['Insuline'],
      isArchived: false,
      createdBy: '507f1f77bcf86cd799439011'
    });

    const findOneSpy = jest.spyOn(Patient, 'findOne').mockResolvedValueOnce(doc);

    const res = await request(app)
      .get('/api/patients/me')
      .set('Authorization', `Bearer ${signToken('patient')}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.patient.cin).toBe('EF112233');
    expect(res.body.data.patient.allergies).toEqual(['Pénicilline']);
    expect(findOneSpy).toHaveBeenCalledWith({
      userId: PATIENT_USER_ID,
      isArchived: { $ne: true }
    });
  });

  it('falls back to matching by contact.email when userId is not linked yet', async () => {
    const doc = new Patient({
      firstName: 'Amine',
      lastName: 'Chraibi',
      cin: 'EF112233',
      dateOfBirth: new Date('1995-03-22'),
      gender: 'M',
      contact: { phone: '0612345678', email: 'amine.patient@meditrack.ma' },
      isArchived: false,
      createdBy: '507f1f77bcf86cd799439011'
    });

    const findOneSpy = jest
      .spyOn(Patient, 'findOne')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(doc);

    const res = await request(app)
      .get('/api/patients/me')
      .set('Authorization', `Bearer ${signToken('patient')}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.patient.firstName).toBe('Amine');
    expect(findOneSpy).toHaveBeenNthCalledWith(2, {
      'contact.email': 'amine.patient@meditrack.ma',
      isArchived: { $ne: true }
    });
  });

  it('returns 404 when no active medical dossier exists for the connected patient', async () => {
    jest.spyOn(Patient, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .get('/api/patients/me')
      .set('Authorization', `Bearer ${signToken('patient')}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Aucun dossier médical/i);
  });
});
