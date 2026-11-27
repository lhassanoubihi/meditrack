const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/server');
const env = require('../src/config/env');
const { Patient } = require('../src/models/Patient.model');

const signToken = (role, sub = new mongoose.Types.ObjectId().toString()) =>
  jwt.sign({ sub, email: `${role}@meditrack.ma`, role }, env.jwtSecret, { expiresIn: '1h' });

describe('US-10 — Mise à jour du dossier patient (PUT /api/patients/:id) & Historique tracé (T1, T3)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const buildPatientDoc = (overrides = {}) => {
    const doc = new Patient({
      firstName: 'Youssef',
      lastName: 'Benali',
      cin: 'CD123456',
      dateOfBirth: new Date('1992-05-14'),
      gender: 'M',
      bloodGroup: 'O+',
      contact: {
        phone: '+212661234567',
        email: 'youssef@meditrack.ma',
        address: '14 Avenue Mohammed V, Meknès',
        emergencyContact: {
          name: 'Fatima Benali',
          phone: '+212661000111',
          relation: 'Mère'
        }
      },
      antecedents: ['Hypertension'],
      allergies: ['Pénicilline'],
      traitements: ['Amlodipine 5mg'],
      notes: 'Suivi initial',
      isArchived: false,
      createdBy: new mongoose.Types.ObjectId(),
      ...overrides
    });
    doc.save = jest.fn().mockResolvedValue(doc);
    return doc;
  };

  describe('GET /api/patients/:id', () => {
    it('returns 200 with patient details for authorized clinical roles', async () => {
      const patientDoc = buildPatientDoc();
      jest.spyOn(Patient, 'findById').mockResolvedValue(patientDoc);

      const res = await request(app)
        .get(`/api/patients/${patientDoc._id}`)
        .set('Authorization', `Bearer ${signToken('medecin')}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.patient.cin).toBe('CD123456');
    });

    it('returns 400 on invalid id, 404 when not found, 401/403 when unauthorized', async () => {
      const badIdRes = await request(app)
        .get('/api/patients/invalid-id')
        .set('Authorization', `Bearer ${signToken('medecin')}`);
      expect(badIdRes.statusCode).toBe(400);

      jest.spyOn(Patient, 'findById').mockResolvedValue(null);
      const notFoundRes = await request(app)
        .get(`/api/patients/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${signToken('admin')}`);
      expect(notFoundRes.statusCode).toBe(404);

      const unauthRes = await request(app).get(`/api/patients/${new mongoose.Types.ObjectId()}`);
      expect(unauthRes.statusCode).toBe(401);

      const forbiddenRes = await request(app)
        .get(`/api/patients/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${signToken('patient')}`);
      expect(forbiddenRes.statusCode).toBe(403);
    });
  });

  describe('PUT /api/patients/:id', () => {
    it('updates antecedents, allergies, traitements and contact and appends traced modificationHistory (date, author, diff)', async () => {
      const doctorId = new mongoose.Types.ObjectId().toString();
      const patientDoc = buildPatientDoc();
      jest.spyOn(Patient, 'findById').mockResolvedValue(patientDoc);

      const res = await request(app)
        .put(`/api/patients/${patientDoc._id}`)
        .set('Authorization', `Bearer ${signToken('medecin', doctorId)}`)
        .send({
          antecedents: ['Hypertension', 'Diabète type 2'],
          allergies: 'Pénicilline, Latex',
          traitements: ['Amlodipine 5mg', 'Metformine 500mg'],
          contact: {
            phone: '+212661999888',
            emergencyContact: { phone: '+212661000222' }
          },
          notes: 'Nouveau traitement antidiabétique initié',
          modificationSummary: 'Ajout diagnostic diabète type 2 et allergie latex'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(patientDoc.save).toHaveBeenCalledTimes(1);

      const updated = res.body.data.patient;
      expect(updated.antecedents).toEqual(['Hypertension', 'Diabète type 2']);
      expect(updated.allergies).toEqual(['Pénicilline', 'Latex']);
      expect(updated.traitements).toEqual(['Amlodipine 5mg', 'Metformine 500mg']);
      expect(updated.contact.phone).toBe('+212661999888');
      expect(updated.contact.emergencyContact.phone).toBe('+212661000222');
      expect(String(updated.updatedBy)).toBe(doctorId);

      expect(updated.modificationHistory).toHaveLength(1);
      const entry = updated.modificationHistory[0];
      expect(String(entry.modifiedBy)).toBe(doctorId);
      expect(entry.modifiedAt).toBeDefined();
      expect(entry.summary).toBe('Ajout diagnostic diabète type 2 et allergie latex');
      expect(entry.changes.allergies).toEqual({
        before: ['Pénicilline'],
        after: ['Pénicilline', 'Latex']
      });
      expect(entry.changes['contact.phone']).toEqual({
        before: '+212661234567',
        after: '+212661999888'
      });
    });

    it('auto-generates modification summary when modificationSummary is omitted and supports CIN update', async () => {
      const nurseId = new mongoose.Types.ObjectId().toString();
      const patientDoc = buildPatientDoc();
      jest.spyOn(Patient, 'findById').mockResolvedValue(patientDoc);
      jest.spyOn(Patient, 'findOne').mockResolvedValue(null);

      const res = await request(app)
        .put(`/api/patients/${patientDoc._id}`)
        .set('Authorization', `Bearer ${signToken('infirmier', nurseId)}`)
        .send({
          cin: 'ab998877',
          bloodGroup: 'A+'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.patient.cin).toBe('AB998877');
      expect(res.body.data.patient.bloodGroup).toBe('A+');
      expect(res.body.data.patient.modificationHistory[0].summary).toContain('cin');
      expect(res.body.data.patient.modificationHistory[0].summary).toContain('bloodGroup');
    });

    it('returns 409 Conflict when updating CIN to one already owned by another patient', async () => {
      const patientDoc = buildPatientDoc();
      jest.spyOn(Patient, 'findById').mockResolvedValue(patientDoc);
      jest.spyOn(Patient, 'findOne').mockResolvedValue({ _id: new mongoose.Types.ObjectId(), cin: 'EE777777' });

      const res = await request(app)
        .put(`/api/patients/${patientDoc._id}`)
        .set('Authorization', `Bearer ${signToken('admin')}`)
        .send({ cin: 'EE777777' });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toMatch(/EE777777/);
    });

    it('returns 409 Conflict when attempting to modify an archived patient record', async () => {
      const archivedDoc = buildPatientDoc({ isArchived: true });
      jest.spyOn(Patient, 'findById').mockResolvedValue(archivedDoc);

      const res = await request(app)
        .put(`/api/patients/${archivedDoc._id}`)
        .set('Authorization', `Bearer ${signToken('medecin')}`)
        .send({ notes: 'Tentative de modification' });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toMatch(/archivé/i);
    });

    it('returns 400 for invalid ObjectId, empty payload or invalid field values', async () => {
      const token = signToken('medecin');

      const badIdRes = await request(app)
        .put('/api/patients/not-valid-id')
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Test' });
      expect(badIdRes.statusCode).toBe(400);

      const emptyRes = await request(app)
        .put(`/api/patients/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(emptyRes.statusCode).toBe(400);

      const futureDate = new Date(Date.now() + 86400000 * 30).toISOString();
      const invalidFieldsRes = await request(app)
        .put(`/api/patients/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'A',
          lastName: 'B',
          cin: '!',
          dateOfBirth: futureDate,
          gender: 'Unknown',
          bloodGroup: 'INVALID',
          contact: { phone: '12', email: 'bad-email' },
          userId: 'bad-object-id'
        });
      expect(invalidFieldsRes.statusCode).toBe(400);
      expect(invalidFieldsRes.body.details.length).toBeGreaterThanOrEqual(8);
    });

    it('returns 404 when patient does not exist and 401/403 when unauthorized', async () => {
      jest.spyOn(Patient, 'findById').mockResolvedValue(null);
      const notFoundRes = await request(app)
        .put(`/api/patients/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${signToken('medecin')}`)
        .send({ notes: 'MAJ' });
      expect(notFoundRes.statusCode).toBe(404);

      const unauthRes = await request(app)
        .put(`/api/patients/${new mongoose.Types.ObjectId()}`)
        .send({ notes: 'MAJ' });
      expect(unauthRes.statusCode).toBe(401);

      for (const forbiddenRole of ['patient', 'pharmacien']) {
        const res = await request(app)
          .put(`/api/patients/${new mongoose.Types.ObjectId()}`)
          .set('Authorization', `Bearer ${signToken(forbiddenRole)}`)
          .send({ notes: 'MAJ' });
        expect(res.statusCode).toBe(403);
      }
    });
  });
});
