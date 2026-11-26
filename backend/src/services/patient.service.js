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

module.exports = {
  normalizeStringArray,
  sanitizePatient,
  validateCreatePatientPayload,
  createPatient
};
