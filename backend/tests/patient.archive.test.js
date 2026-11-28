const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/server');
const env = require('../src/config/env');
const { Patient } = require('../src/models/Patient.model');

const ACTOR_ID = '507f1f77bcf86cd799439011';
const PATIENT_ID = '507f1f77bcf86cd799439022';

const signToken = (role = 'admin', sub = ACTOR_ID) =>
  jwt.sign({ sub, email: `${role}@meditrack.ma`, role }, env.jwtSecret, { expiresIn: '1h' });

describe('US-11 — Archivage du dossier patient (soft delete)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 401 when unauthenticated and 403 for infirmier, patient or pharmacien', async () => {
    const unauth = await request(app).patch(`/api/patients/${PATIENT_ID}/archive`);
    expect(unauth.statusCode).toBe(401);

    for (const forbiddenRole of ['infirmier', 'patient', 'pharmacien']) {
      const res = await request(app)
        .patch(`/api/patients/${PATIENT_ID}/archive`)
        .set('Authorization', `Bearer ${signToken(forbiddenRole)}`);
      expect(res.statusCode).toBe(403);
    }
  });

  it('returns 400 on invalid ObjectId and 404 when patient is not found', async () => {
    const invalidRes = await request(app)
      .patch('/api/patients/not-a-valid-id/archive')
      .set('Authorization', `Bearer ${signToken('admin')}`);
    expect(invalidRes.statusCode).toBe(400);

    jest.spyOn(Patient, 'findById').mockResolvedValue(null);
    const notFoundRes = await request(app)
      .patch(`/api/patients/${PATIENT_ID}/archive`)
      .set('Authorization', `Bearer ${signToken('medecin')}`);
    expect(notFoundRes.statusCode).toBe(404);
  });

  it('returns 409 if patient dossier is already archived', async () => {
    const archivedDoc = new Patient({
      _id: PATIENT_ID,
      firstName: 'Salma',
      lastName: 'Bennani',
      cin: 'BK445566',
      dateOfBirth: new Date('1990-02-10'),
      gender: 'F',
      contact: { phone: '0611223344' },
      isArchived: true,
      createdBy: ACTOR_ID
    });
    jest.spyOn(Patient, 'findById').mockResolvedValue(archivedDoc);

    const res = await request(app)
      .patch(`/api/patients/${PATIENT_ID}/archive`)
      .set('Authorization', `Bearer ${signToken('admin')}`);
    expect(res.statusCode).toBe(409);
  });

  it('soft-deletes patient dossier via PATCH /archive and DELETE /:id while tracing modificationHistory', async () => {
    const activeDoc = new Patient({
      _id: PATIENT_ID,
      firstName: 'Karim',
      lastName: 'Tazi',
      cin: 'CD778899',
      dateOfBirth: new Date('1988-09-20'),
      gender: 'M',
      contact: { phone: '0655443322' },
      isArchived: false,
      createdBy: ACTOR_ID
    });
    activeDoc.save = jest.fn().mockResolvedValue(activeDoc);
    jest.spyOn(Patient, 'findById').mockResolvedValue(activeDoc);

    const res = await request(app)
      .patch(`/api/patients/${PATIENT_ID}/archive`)
      .set('Authorization', `Bearer ${signToken('medecin')}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.patient.isArchived).toBe(true);
    expect(activeDoc.archivedAt).toBeInstanceOf(Date);
    expect(String(activeDoc.archivedBy)).toBe(ACTOR_ID);
    expect(activeDoc.modificationHistory).toHaveLength(1);
    expect(activeDoc.modificationHistory[0].summary).toMatch(/Archivage/i);
    expect(activeDoc.save).toHaveBeenCalledTimes(1);
  });
});
