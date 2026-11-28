const mongoose = require('mongoose');
const { Patient, GENDERS, BLOOD_GROUPS, CIN_REGEX } = require('../models/Patient.model');
const { EMAIL_REGEX } = require('../models/User.model');
const { AppError } = require('../middlewares/errorHandler.middleware');

function normalizeStringArray(value) {
  if (!value) {
    return [];
  }

  const rawItems = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/[\n,;]+/)
      : [];

  const seen = new Set();
  const normalized = [];

  for (const item of rawItems) {
    const cleaned = String(item || '').trim();
    const key = cleaned.toLowerCase();
    if (cleaned && !seen.has(key)) {
      seen.add(key);
      normalized.push(cleaned);
    }
  }

  return normalized;
}

function sanitizePatient(patient) {
  if (!patient) {
    return null;
  }
  const obj = typeof patient.toJSON === 'function' ? patient.toJSON() : { ...patient };
  delete obj.__v;
  return obj;
}

function validateCreatePatientPayload(payload = {}) {
  const errors = [];

  const firstName = typeof payload.firstName === 'string' ? payload.firstName.trim() : '';
  const lastName = typeof payload.lastName === 'string' ? payload.lastName.trim() : '';
  const cin = typeof payload.cin === 'string' ? payload.cin.trim().toUpperCase() : '';
  const gender = typeof payload.gender === 'string' ? payload.gender.trim() : '';
  const bloodGroup =
    typeof payload.bloodGroup === 'string' && payload.bloodGroup.trim()
      ? payload.bloodGroup.trim()
      : 'Inconnu';

  const parsedDob = payload.dateOfBirth ? new Date(payload.dateOfBirth) : null;
  const contactInput = payload.contact && typeof payload.contact === 'object' ? payload.contact : {};
  const phone = typeof contactInput.phone === 'string' ? contactInput.phone.trim() : '';
  const email = typeof contactInput.email === 'string' ? contactInput.email.trim().toLowerCase() : '';
  const address = typeof contactInput.address === 'string' ? contactInput.address.trim() : '';
  const emergencyInput =
    contactInput.emergencyContact && typeof contactInput.emergencyContact === 'object'
      ? contactInput.emergencyContact
      : {};

  if (firstName.length < 2) {
    errors.push('Le prénom du patient doit contenir au moins 2 caractères');
  }
  if (lastName.length < 2) {
    errors.push('Le nom du patient doit contenir au moins 2 caractères');
  }
  if (!CIN_REGEX.test(cin)) {
    errors.push('Le numéro CIN est invalide (4 à 20 caractères alphanumériques)');
  }
  if (!parsedDob || Number.isNaN(parsedDob.getTime())) {
    errors.push('La date de naissance est obligatoire et doit être valide');
  } else if (parsedDob > new Date()) {
    errors.push('La date de naissance ne peut pas être dans le futur');
  }
  if (!GENDERS.includes(gender)) {
    errors.push(`Le genre doit être l'une des valeurs suivantes : ${GENDERS.join(', ')}`);
  }
  if (!BLOOD_GROUPS.includes(bloodGroup)) {
    errors.push(`Le groupe sanguin doit être valide (${BLOOD_GROUPS.join(', ')})`);
  }
  if (phone.length < 6) {
    errors.push('Le numéro de téléphone de contact est obligatoire (min. 6 caractères)');
  }
  if (email && !EMAIL_REGEX.test(email)) {
    errors.push('L\'adresse email de contact est invalide');
  }

  let userId = null;
  if (payload.userId !== undefined && payload.userId !== null && payload.userId !== '') {
    if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
      errors.push('Identifiant compte utilisateur (userId) invalide');
    } else {
      userId = payload.userId;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      userId,
      firstName,
      lastName,
      cin,
      dateOfBirth: parsedDob,
      gender,
      bloodGroup,
      contact: {
        phone,
        email,
        address,
        emergencyContact: {
          name: typeof emergencyInput.name === 'string' ? emergencyInput.name.trim() : '',
          phone: typeof emergencyInput.phone === 'string' ? emergencyInput.phone.trim() : '',
          relation: typeof emergencyInput.relation === 'string' ? emergencyInput.relation.trim() : ''
        }
      },
      antecedents: normalizeStringArray(payload.antecedents),
      allergies: normalizeStringArray(payload.allergies),
      traitements: normalizeStringArray(payload.traitements),
      notes: typeof payload.notes === 'string' ? payload.notes.trim() : ''
    }
  };
}

function validateUpdatePatientPayload(payload = {}) {
  const errors = [];
  const updates = {};

  if (payload.firstName !== undefined) {
    const val = typeof payload.firstName === 'string' ? payload.firstName.trim() : '';
    if (val.length < 2 || val.length > 60) {
      errors.push('Le prénom du patient doit contenir entre 2 et 60 caractères');
    } else {
      updates.firstName = val;
    }
  }

  if (payload.lastName !== undefined) {
    const val = typeof payload.lastName === 'string' ? payload.lastName.trim() : '';
    if (val.length < 2 || val.length > 60) {
      errors.push('Le nom du patient doit contenir entre 2 et 60 caractères');
    } else {
      updates.lastName = val;
    }
  }

  if (payload.cin !== undefined) {
    const val = typeof payload.cin === 'string' ? payload.cin.trim().toUpperCase() : '';
    if (!CIN_REGEX.test(val)) {
      errors.push('Le numéro CIN est invalide (4 à 20 caractères alphanumériques)');
    } else {
      updates.cin = val;
    }
  }

  if (payload.dateOfBirth !== undefined) {
    const parsed = new Date(payload.dateOfBirth);
    if (Number.isNaN(parsed.getTime())) {
      errors.push('La date de naissance est invalide');
    } else if (parsed > new Date()) {
      errors.push('La date de naissance ne peut pas être dans le futur');
    } else {
      updates.dateOfBirth = parsed;
    }
  }

  if (payload.gender !== undefined) {
    const val = typeof payload.gender === 'string' ? payload.gender.trim() : '';
    if (!GENDERS.includes(val)) {
      errors.push(`Le genre doit être l'une des valeurs suivantes : ${GENDERS.join(', ')}`);
    } else {
      updates.gender = val;
    }
  }

  if (payload.bloodGroup !== undefined) {
    const val = typeof payload.bloodGroup === 'string' ? payload.bloodGroup.trim() : '';
    if (!BLOOD_GROUPS.includes(val)) {
      errors.push(`Le groupe sanguin doit être valide (${BLOOD_GROUPS.join(', ')})`);
    } else {
      updates.bloodGroup = val;
    }
  }

  if (payload.contact !== undefined) {
    if (!payload.contact || typeof payload.contact !== 'object') {
      errors.push('Les informations de contact sont invalides');
    } else {
      const contactUpdates = {};
      if (payload.contact.phone !== undefined) {
        const phone = typeof payload.contact.phone === 'string' ? payload.contact.phone.trim() : '';
        if (phone.length < 6 || phone.length > 30) {
          errors.push('Le numéro de téléphone doit contenir entre 6 et 30 caractères');
        } else {
          contactUpdates.phone = phone;
        }
      }
      if (payload.contact.email !== undefined) {
        const email =
          typeof payload.contact.email === 'string' ? payload.contact.email.trim().toLowerCase() : '';
        if (email && !EMAIL_REGEX.test(email)) {
          errors.push('L\'adresse email de contact est invalide');
        } else {
          contactUpdates.email = email;
        }
      }
      if (payload.contact.address !== undefined) {
        contactUpdates.address =
          typeof payload.contact.address === 'string' ? payload.contact.address.trim() : '';
      }
      if (
        payload.contact.emergencyContact !== undefined &&
        payload.contact.emergencyContact &&
        typeof payload.contact.emergencyContact === 'object'
      ) {
        const ec = payload.contact.emergencyContact;
        contactUpdates.emergencyContact = {
          name: typeof ec.name === 'string' ? ec.name.trim() : undefined,
          phone: typeof ec.phone === 'string' ? ec.phone.trim() : undefined,
          relation: typeof ec.relation === 'string' ? ec.relation.trim() : undefined
        };
      }
      if (Object.keys(contactUpdates).length > 0) {
        updates.contact = contactUpdates;
      }
    }
  }

  if (payload.antecedents !== undefined) {
    updates.antecedents = normalizeStringArray(payload.antecedents);
  }
  if (payload.allergies !== undefined) {
    updates.allergies = normalizeStringArray(payload.allergies);
  }
  if (payload.traitements !== undefined) {
    updates.traitements = normalizeStringArray(payload.traitements);
  }
  if (payload.notes !== undefined) {
    updates.notes = typeof payload.notes === 'string' ? payload.notes.trim() : '';
  }

  if (payload.userId !== undefined) {
    if (payload.userId === null || payload.userId === '') {
      updates.userId = null;
    } else if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
      errors.push('Identifiant compte utilisateur (userId) invalide');
    } else {
      updates.userId = payload.userId;
    }
  }

  const modificationSummary =
    typeof payload.modificationSummary === 'string' ? payload.modificationSummary.trim() : '';

  if (errors.length === 0 && Object.keys(updates).length === 0) {
    errors.push('Aucun champ valide fourni pour la mise à jour du dossier patient');
  }

  return {
    isValid: errors.length === 0,
    errors,
    updates,
    modificationSummary
  };
}

function valuesEqual(a, b) {
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, idx) => v === b[idx]);
  }
  return a === b;
}

function applyUpdatesAndComputeChanges(patient, updates) {
  const changes = {};

  const topLevelFields = [
    'firstName',
    'lastName',
    'cin',
    'dateOfBirth',
    'gender',
    'bloodGroup',
    'antecedents',
    'allergies',
    'traitements',
    'notes',
    'userId'
  ];

  for (const field of topLevelFields) {
    if (updates[field] !== undefined) {
      const before = Array.isArray(patient[field]) ? [...patient[field]] : patient[field];
      const after = updates[field];
      if (!valuesEqual(before, after)) {
        changes[field] = {
          before: before instanceof Date ? before.toISOString() : before,
          after: after instanceof Date ? after.toISOString() : after
        };
        patient[field] = after;
      }
    }
  }

  if (updates.contact) {
    patient.contact = patient.contact || {};
    for (const contactField of ['phone', 'email', 'address']) {
      if (updates.contact[contactField] !== undefined) {
        const before = patient.contact[contactField] || '';
        const after = updates.contact[contactField];
        if (before !== after) {
          changes[`contact.${contactField}`] = { before, after };
          patient.contact[contactField] = after;
        }
      }
    }

    if (updates.contact.emergencyContact) {
      patient.contact.emergencyContact = patient.contact.emergencyContact || {};
      for (const ecField of ['name', 'phone', 'relation']) {
        if (updates.contact.emergencyContact[ecField] !== undefined) {
          const before = patient.contact.emergencyContact[ecField] || '';
          const after = updates.contact.emergencyContact[ecField];
          if (before !== after) {
            changes[`contact.emergencyContact.${ecField}`] = { before, after };
            patient.contact.emergencyContact[ecField] = after;
          }
        }
      }
    }
  }

  return changes;
}

async function createPatient(payload, actorId) {
  const { isValid, errors, data } = validateCreatePatientPayload(payload);

  if (!isValid) {
    throw new AppError('Données du dossier patient invalides', 400, errors);
  }

  const existing = await Patient.findOne({ cin: data.cin });
  if (existing) {
    throw new AppError(`Un dossier patient avec le CIN '${data.cin}' existe déjà`, 409);
  }

  const created = await Patient.create({
    ...data,
    isArchived: false,
    createdBy: actorId,
    updatedBy: actorId
  });

  return sanitizePatient(created);
}

async function getPatientById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Identifiant dossier patient invalide', 400);
  }

  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError('Dossier patient introuvable', 404);
  }

  return sanitizePatient(patient);
}

async function updatePatient(id, payload, actorId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Identifiant dossier patient invalide', 400);
  }

  const { isValid, errors, updates, modificationSummary } = validateUpdatePatientPayload(payload);
  if (!isValid) {
    throw new AppError('Données de mise à jour du dossier patient invalides', 400, errors);
  }

  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError('Dossier patient introuvable', 404);
  }

  if (patient.isArchived) {
    throw new AppError('Impossible de modifier un dossier patient archivé', 409);
  }

  if (updates.cin && updates.cin !== patient.cin) {
    const duplicate = await Patient.findOne({
      cin: updates.cin,
      _id: { $ne: patient._id }
    });
    if (duplicate) {
      throw new AppError(`Un autre dossier patient utilise déjà le CIN '${updates.cin}'`, 409);
    }
  }

  const changes = applyUpdatesAndComputeChanges(patient, updates);
  const changedFields = Object.keys(changes);

  if (changedFields.length > 0 || modificationSummary) {
    patient.updatedBy = actorId;
    patient.modificationHistory = patient.modificationHistory || [];
    patient.modificationHistory.push({
      modifiedAt: new Date(),
      modifiedBy: actorId,
      summary:
        modificationSummary || `Mise à jour des champs : ${changedFields.join(', ')}`,
      changes
    });
    await patient.save();
  }

  return sanitizePatient(patient);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getPatientByUser(user) {
  if (!user || !user.id) {
    throw new AppError('Authentification requise', 401);
  }

  let patient = null;
  if (mongoose.Types.ObjectId.isValid(user.id)) {
    patient = await Patient.findOne({ userId: user.id, isArchived: { $ne: true } });
  }

  if (!patient && user.email) {
    patient = await Patient.findOne({
      'contact.email': String(user.email).trim().toLowerCase(),
      isArchived: { $ne: true }
    });
  }

  if (!patient) {
    throw new AppError(
      'Aucun dossier médical associé à votre compte patient pour le moment',
      404
    );
  }

  return sanitizePatient(patient);
}

async function listPatients({ search = '', page = 1, limit = 10, includeArchived = false } = {}) {
  const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {};
  const showArchived = includeArchived === true || includeArchived === 'true';
  if (!showArchived) {
    filter.isArchived = { $ne: true };
  }

  const trimmedSearch = typeof search === 'string' ? search.trim() : '';
  if (trimmedSearch) {
    const regex = new RegExp(escapeRegex(trimmedSearch), 'i');
    filter.$or = [{ firstName: regex }, { lastName: regex }, { cin: regex }];
  }

  const [patients, total] = await Promise.all([
    Patient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
    Patient.countDocuments(filter)
  ]);

  return {
    patients: patients.map(sanitizePatient),
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.max(1, Math.ceil(total / parsedLimit))
    }
  };
}

module.exports = {
  normalizeStringArray,
  sanitizePatient,
  validateCreatePatientPayload,
  validateUpdatePatientPayload,
  createPatient,
  listPatients,
  getPatientById,
  getPatientByUser,
  updatePatient
};
