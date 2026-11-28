const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/server');
const env = require('../src/config/env');
const cryptoUtil = require('../src/utils/crypto.util');
const { Patient } = require('../src/models/Patient.model');
const { AuditLog } = require('../src/models/AuditLog.model');

const signToken = (role, sub = new mongoose.Types.ObjectId().toString()) =>
  jwt.sign({ sub, email: `${role}@meditrack.ma`, role }, env.jwtSecret, { expiresIn: '1h' });

describe('US-14 — RGPD : Chiffrement AES-256-GCM, cinHash & Journal d\'audit AuditLog (T1–T5)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Utilitaire Crypto AES-256-GCM (US-14-T1)', () => {
    it('encrypts and decrypts UTF-8 sensitive strings with unique random IVs', () => {
      const secret = 'Diabète type 2 — Pénicilline — CD123456';
      const c1 = cryptoUtil.encrypt(secret);
      const c2 = cryptoUtil.encrypt(secret);

      expect(cryptoUtil.isEncrypted(c1)).toBe(true);
      expect(c1).not.toContain(secret);
      expect(c1).not.toBe(c2); // Random 12-byte IV guarantees semantic security

      expect(cryptoUtil.decrypt(c1)).toBe(secret);
      expect(cryptoUtil.decrypt(c2)).toBe(secret);

      // Idempotent encrypt & plaintext passthrough decrypt
      expect(cryptoUtil.encrypt(c1)).toBe(c1);
      expect(cryptoUtil.decrypt('plain-value')).toBe('plain-value');
      expect(cryptoUtil.encrypt('')).toBe('');
      expect(cryptoUtil.decrypt(null)).toBeNull();
    });

    it('detects tampered ciphertext or wrong key via GCM authentication tag', () => {
      const cipherText = cryptoUtil.encrypt('CD987654');
      const tampered = `${cipherText.slice(0, -2)}ff`;
      expect(() => cryptoUtil.decrypt(tampered)).toThrow();

      const wrongKey = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
      expect(() => cryptoUtil.decrypt(cipherText, wrongKey)).toThrow();
      expect(() => cryptoUtil.encrypt('data', 'too-short')).toThrow(/ENCRYPTION_KEY invalide/);
      expect(() => cryptoUtil.decrypt('enc:v1:malformed')).toThrow(/Format de donnée chiffrée/);
    });

    it('produces deterministic normalized HMAC-SHA256 cinHash and handles string arrays', () => {
      const h1 = cryptoUtil.hashValue(' cd123456 ');
      const h2 = cryptoUtil.hashValue('CD123456');
      expect(h1).toHaveLength(64);
      expect(h1).toBe(h2);
      expect(cryptoUtil.hashValue('')).toBeNull();

      const encArr = cryptoUtil.encryptStringArray(['Asthme', 'Allergie']);
      expect(encArr.every((v) => cryptoUtil.isEncrypted(v))).toBe(true);
      expect(cryptoUtil.decryptStringArray(encArr)).toEqual(['Asthme', 'Allergie']);
    });
  });

  describe('Chiffrement des champs sensibles du modèle Patient + cinHash (US-14-T2 & T5)', () => {
    it('encrypts sensitive fields in pre-save hook, stores cinHash, and decrypts transparently on toJSON', () => {
      const patient = new Patient({
        firstName: 'Kenza',
        lastName: 'Tazi',
        cin: 'ab554433',
        dateOfBirth: new Date('1995-03-10'),
        gender: 'F',
        bloodGroup: 'A+',
        contact: {
          phone: '+212661112233',
          email: 'kenza@meditrack.ma',
          address: '22 Rue Zerktouni, Meknès'
        },
        antecedents: ['Asthme chronique'],
        allergies: ['Pénicilline'],
        traitements: ['Ventoline 100µg'],
        notes: 'Suivi pneumologie trimestriel',
        createdBy: new mongoose.Types.ObjectId()
      });

      // Invoke Mongoose pre('save') hook directly
      const preSaveHooks = Patient.schema.s.hooks._pres.get('save') || [];
      const encryptHook = preSaveHooks.find(
        (h) => h.fn.name === 'encryptSensitiveFieldsBeforeSave'
      );
      expect(encryptHook).toBeDefined();
      encryptHook.fn.call(patient);

      // Verify raw stored values are AES-256-GCM encrypted
      expect(cryptoUtil.isEncrypted(patient.cin)).toBe(true);
      expect(patient.cinHash).toBe(cryptoUtil.hashValue('AB554433'));
      expect(cryptoUtil.isEncrypted(patient.contact.phone)).toBe(true);
      expect(cryptoUtil.isEncrypted(patient.contact.address)).toBe(true);
      expect(cryptoUtil.isEncrypted(patient.antecedents[0])).toBe(true);
      expect(cryptoUtil.isEncrypted(patient.allergies[0])).toBe(true);
      expect(cryptoUtil.isEncrypted(patient.traitements[0])).toBe(true);
      expect(cryptoUtil.isEncrypted(patient.notes)).toBe(true);

      // Verify toJSON transparently decrypts all sensitive fields and hides cinHash
      const json = patient.toJSON();
      expect(json.cin).toBe('AB554433');
      expect(json.cinHash).toBeUndefined();
      expect(json.contact.phone).toBe('+212661112233');
      expect(json.contact.address).toBe('22 Rue Zerktouni, Meknès');
      expect(json.antecedents).toEqual(['Asthme chronique']);
      expect(json.allergies).toEqual(['Pénicilline']);
      expect(json.traitements).toEqual(['Ventoline 100µg']);
      expect(json.notes).toBe('Suivi pneumologie trimestriel');
    });

    it('includes cinHash clause when searching patients by CIN on GET /api/patients', async () => {
      const auditSpy = jest.spyOn(AuditLog, 'create').mockResolvedValue({});
      const chain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };
      const findSpy = jest.spyOn(Patient, 'find').mockReturnValue(chain);
      jest.spyOn(Patient, 'countDocuments').mockResolvedValue(0);

      const res = await request(app)
        .get('/api/patients?search=AB554433')
        .set('Authorization', `Bearer ${signToken('medecin')}`);

      expect(res.statusCode).toBe(200);
      const passedFilter = findSpy.mock.calls[0][0];
      expect(passedFilter.$or).toEqual(
        expect.arrayContaining([{ cinHash: cryptoUtil.hashValue('AB554433') }])
      );
      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'PATIENT_LIST',
          resource: 'Patient',
          actorRole: 'medecin',
          statusCode: 200
        })
      );
    });
  });

  describe('Journal d\'audit AuditLog sur routes Patient & GET /api/audit-logs (US-14-T3, T4, T5)', () => {
    it('creates an AuditLog entry when a medecin views a patient record (GET /api/patients/:id)', async () => {
      const doctorId = new mongoose.Types.ObjectId().toString();
      const patientDoc = new Patient({
        firstName: 'Kenza',
        lastName: 'Tazi',
        cin: cryptoUtil.encrypt('AB554433'),
        cinHash: cryptoUtil.hashValue('AB554433'),
        dateOfBirth: new Date('1995-03-10'),
        gender: 'F',
        contact: { phone: cryptoUtil.encrypt('+212661112233') },
        allergies: [cryptoUtil.encrypt('Pénicilline')],
        createdBy: new mongoose.Types.ObjectId()
      });

      jest.spyOn(Patient, 'findById').mockResolvedValue(patientDoc);
      const auditSpy = jest.spyOn(AuditLog, 'create').mockResolvedValue({ _id: 'log-1' });

      const res = await request(app)
        .get(`/api/patients/${patientDoc._id}`)
        .set('Authorization', `Bearer ${signToken('medecin', doctorId)}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.patient.cin).toBe('AB554433');
      expect(res.body.data.patient.allergies).toEqual(['Pénicilline']);

      expect(auditSpy).toHaveBeenCalledTimes(1);
      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'PATIENT_VIEW',
          resource: 'Patient',
          resourceId: String(patientDoc._id),
          actorId: doctorId,
          actorRole: 'medecin',
          method: 'GET',
          statusCode: 200
        })
      );
    });

    it('creates an AuditLog entry with created patient id on POST /api/patients', async () => {
      const doctorId = new mongoose.Types.ObjectId().toString();
      jest.spyOn(Patient, 'findOne').mockResolvedValue(null);
      jest.spyOn(Patient, 'create').mockImplementation(async (doc) => new Patient(doc));
      const auditSpy = jest.spyOn(AuditLog, 'create').mockResolvedValue({});

      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${signToken('medecin', doctorId)}`)
        .send({
          firstName: 'Omar',
          lastName: 'Idrissi',
          cin: 'EE112233',
          dateOfBirth: '1988-09-20',
          gender: 'M',
          contact: { phone: '+212661334455' }
        });

      expect(res.statusCode).toBe(201);
      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'PATIENT_CREATE',
          resource: 'Patient',
          resourceId: String(res.body.data.patient._id),
          actorId: doctorId,
          statusCode: 201
        })
      );
    });

    it('GET /api/audit-logs returns paginated logs for admin and 403/401 for non-admin/unauthenticated', async () => {
      const unauthRes = await request(app).get('/api/audit-logs');
      expect(unauthRes.statusCode).toBe(401);

      for (const forbiddenRole of ['medecin', 'infirmier', 'patient', 'pharmacien']) {
        const res = await request(app)
          .get('/api/audit-logs')
          .set('Authorization', `Bearer ${signToken(forbiddenRole)}`);
        expect(res.statusCode).toBe(403);
      }

      const logDoc = new AuditLog({
        action: 'PATIENT_VIEW',
        resource: 'Patient',
        resourceId: '507f1f77bcf86cd799439011',
        actorId: new mongoose.Types.ObjectId(),
        actorEmail: 'medecin@meditrack.ma',
        actorRole: 'medecin',
        method: 'GET',
        path: '/api/patients/507f1f77bcf86cd799439011',
        statusCode: 200
      });

      const chain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([logDoc])
      };
      const findSpy = jest.spyOn(AuditLog, 'find').mockReturnValue(chain);
      jest.spyOn(AuditLog, 'countDocuments').mockResolvedValue(1);

      const adminRes = await request(app)
        .get('/api/audit-logs?action=patient_view&actorRole=medecin&page=1&limit=10')
        .set('Authorization', `Bearer ${signToken('admin')}`);

      expect(adminRes.statusCode).toBe(200);
      expect(adminRes.body.status).toBe('success');
      expect(adminRes.body.data.logs).toHaveLength(1);
      expect(adminRes.body.data.logs[0].action).toBe('PATIENT_VIEW');
      expect(adminRes.body.data.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      });
      expect(findSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'PATIENT_VIEW',
          actorRole: 'medecin'
        })
      );

      // Invalid actorId or invalid date returns 400
      const badActorRes = await request(app)
        .get('/api/audit-logs?actorId=invalid-id')
        .set('Authorization', `Bearer ${signToken('admin')}`);
      expect(badActorRes.statusCode).toBe(400);

      const badDateRes = await request(app)
        .get('/api/audit-logs?from=not-a-date')
        .set('Authorization', `Bearer ${signToken('admin')}`);
      expect(badDateRes.statusCode).toBe(400);
    });
  });
});
