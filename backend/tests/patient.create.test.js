const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/server');
const env = require('../src/config/env');
const { Patient, GENDERS, BLOOD_GROUPS } = require('../src/models/Patient.model');
const { normalizeStringArray } = require('../src/services/patient.service');

const signToken = (role, sub = new mongoose.Types.ObjectId().toString()) =>
  jwt.sign({ sub, email: `${role}@meditrack.ma`, role }, env.jwtSecret, { expiresIn: '1h' });

describe('US-08 — Modèle Patient & Endpoint POST /api/patients (T1, T2, T4)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const validPatientPayload = {
    firstName: 'Youssef',
    lastName: 'Benali',
    cin: 'cd123456',
    dateOfBirth: '1992-05-14',
    gender: 'M',
    bloodGroup: 'O+',
    contact: {
      phone: '+212661234567',
      email: 'Youssef.Benali@Example.com',
      address: '14 Avenue Mohammed V, Meknès',
      emergencyContact: {
        name: 'Fatima Benali',
        phone: '+212661000111',
        relation: 'Mère'
      }
    },
    antecedents: ['Hypertension artérielle', 'Asthme léger', 'asthme léger'],
    allergies: 'Pénicilline, Arachides',
    traitements: ['Ventoline 100µg'],
    notes: 'Patient suivi en cardiologie.'
  };

  describe('Patient Mongoose Model & Helpers (US-08-T1)', () => {
    it('exports expected GENDERS and BLOOD_GROUPS enums', () => {
      expect(GENDERS).toEqual(['M', 'F', 'Autre']);
      expect(BLOOD_GROUPS).toContain('O+');
      expect(BLOOD_GROUPS).toContain('Inconnu');
    });

    it('validates a complete Patient document and normalizes CIN/email', async () => {
      const doctorId = new mongoose.Types.ObjectId();
      const patient = new Patient({
        ...validPatientPayload,
        allergies: ['Pénicilline'],
        createdBy: doctorId
      });

      await expect(patient.validate()).resolves.toBeUndefined();
      expect(patient.cin).toBe('CD123456');
      expect(patient.contact.email).toBe('youssef.benali@example.com');
      expect(patient.isArchived).toBe(false);

      const json = patient.toJSON();
      expect(json.__v).toBeUndefined();
      expect(json.cin).toBe('CD123456');
    });

    it('rejects future dateOfBirth, invalid CIN, invalid gender and invalid email', async () => {
      const futureDate = new Date(Date.now() + 86400000 * 30);
      const invalidPatient = new Patient({
        firstName: 'A',
        lastName: 'B',
        cin: '12',
        dateOfBirth: futureDate,
        gender: 'X',
        contact: { phone: '123', email: 'bad-email' },
        createdBy: new mongoose.Types.ObjectId()
      });

      await expect(invalidPatient.validate()).rejects.toThrow();
    });

    it('normalizeStringArray trims, splits strings and removes duplicates case-insensitively', () => {
      expect(normalizeStringArray('Diabète, asthme ; Asthme\nHypertension')).toEqual([
        'Diabète',
        'asthme',
        'Hypertension'
      ]);
      expect(normalizeStringArray(['  A ', 'a', '', 'B'])).toEqual(['A', 'B']);
      expect(normalizeStringArray(null)).toEqual([]);
    });
  });

  describe('POST /api/patients (US-08-T2 & US-08-T4)', () => {
    it('creates a patient record (201) when called by a medecin and records createdBy', async () => {
      const doctorId = new mongoose.Types.ObjectId().toString();
      jest.spyOn(Patient, 'findOne').mockResolvedValue(null);
      jest.spyOn(Patient, 'create').mockImplementation(async (doc) => new Patient(doc));

      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${signToken('medecin', doctorId)}`)
        .send(validPatientPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.patient.cin).toBe('CD123456');
      expect(res.body.data.patient.antecedents).toEqual([
        'Hypertension artérielle',
        'Asthme léger'
      ]);
      expect(res.body.data.patient.allergies).toEqual(['Pénicilline', 'Arachides']);
      expect(res.body.data.patient.isArchived).toBe(false);
      expect(String(res.body.data.patient.createdBy)).toBe(doctorId);
    });

    it('allows admin and infirmier roles to create a patient record (201)', async () => {
      jest.spyOn(Patient, 'findOne').mockResolvedValue(null);
      jest.spyOn(Patient, 'create').mockImplementation(async (doc) => new Patient(doc));

      for (const role of ['admin', 'infirmier']) {
        const res = await request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${signToken(role)}`)
          .send(validPatientPayload);
        expect(res.statusCode).toBe(201);
      }
    });

    it('returns 401 when unauthenticated and 403 for patient or pharmacien roles', async () => {
      const unauthRes = await request(app).post('/api/patients').send(validPatientPayload);
      expect(unauthRes.statusCode).toBe(401);

      for (const forbiddenRole of ['patient', 'pharmacien']) {
        const res = await request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${signToken(forbiddenRole)}`)
          .send(validPatientPayload);
        expect(res.statusCode).toBe(403);
      }
    });

    it('returns 409 Conflict when a patient with the same CIN already exists', async () => {
      jest.spyOn(Patient, 'findOne').mockResolvedValue({ _id: 'existing-id', cin: 'CD123456' });

      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${signToken('medecin')}`)
        .send(validPatientPayload);

      expect(res.statusCode).toBe(409);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toMatch(/CD123456/);
    });

    it('returns 400 Bad Request with details for invalid identity, future DOB, bloodGroup, email or userId', async () => {
      const futureDob = new Date(Date.now() + 86400000 * 10).toISOString();
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${signToken('medecin')}`)
        .send({
          firstName: 'A',
          lastName: '',
          cin: '!',
          dateOfBirth: futureDob,
          gender: 'Invalid',
          bloodGroup: 'Z+',
          contact: { phone: '12', email: 'not-email' },
          userId: 'not-an-objectid'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
      expect(Array.isArray(res.body.details)).toBe(true);
      expect(res.body.details.length).toBeGreaterThanOrEqual(7);
    });
  });
});
