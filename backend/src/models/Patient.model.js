const mongoose = require('mongoose');
const { EMAIL_REGEX } = require('./User.model');
const {
  isEncrypted,
  encrypt,
  decrypt,
  hashValue,
  encryptStringArray,
  decryptStringArray
} = require('../utils/crypto.util');

const GENDERS = Object.freeze(['M', 'F', 'Autre']);
const BLOOD_GROUPS = Object.freeze([
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Inconnu'
]);
const CIN_REGEX = /^[A-Z0-9-]{4,20}$/;

const modificationEntrySchema = new mongoose.Schema(
  {
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    summary: {
      type: String,
      trim: true,
      default: ''
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    firstName: {
      type: String,
      required: [true, 'Le prénom du patient est obligatoire'],
      trim: true,
      minlength: [2, 'Le prénom doit contenir au moins 2 caractères'],
      maxlength: [60, 'Le prénom ne peut pas dépasser 60 caractères']
    },
    lastName: {
      type: String,
      required: [true, 'Le nom du patient est obligatoire'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
      maxlength: [60, 'Le nom ne peut pas dépasser 60 caractères']
    },
    cin: {
      type: String,
      required: [true, 'Le numéro CIN est obligatoire'],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => isEncrypted(value) || CIN_REGEX.test(String(value || '').toUpperCase()),
        message: 'Format CIN invalide (4 à 20 caractères alphanumériques)'
      }
    },
    cinHash: {
      type: String,
      default: null,
      index: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'La date de naissance est obligatoire'],
      validate: {
        validator: (value) =>
          value instanceof Date && !Number.isNaN(value.getTime()) && value <= new Date(),
        message: 'La date de naissance ne peut pas être dans le futur'
      }
    },
    gender: {
      type: String,
      required: [true, 'Le genre du patient est obligatoire'],
      enum: {
        values: GENDERS,
        message: 'Genre invalide : {VALUE}'
      }
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUPS,
        message: 'Groupe sanguin invalide : {VALUE}'
      },
      default: 'Inconnu'
    },
    contact: {
      phone: {
        type: String,
        required: [true, 'Le numéro de téléphone est obligatoire'],
        trim: true,
        validate: {
          validator: (val) => isEncrypted(val) || (String(val || '').length >= 6 && String(val || '').length <= 30),
          message: 'Numéro de téléphone invalide (6 à 30 caractères)'
        }
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        default: '',
        validate: {
          validator: (val) => !val || EMAIL_REGEX.test(val),
          message: 'Format d\'adresse email invalide'
        }
      },
      address: {
        type: String,
        trim: true,
        default: ''
      },
      emergencyContact: {
        name: { type: String, trim: true, default: '' },
        phone: { type: String, trim: true, default: '' },
        relation: { type: String, trim: true, default: '' }
      }
    },
    antecedents: {
      type: [String],
      default: []
    },
    allergies: {
      type: [String],
      default: []
    },
    traitements: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    archivedAt: {
      type: Date,
      default: null
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    modificationHistory: {
      type: [modificationEntrySchema],
      default: []
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

function decryptPatientObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (obj.cin) {
    obj.cin = decrypt(obj.cin);
  }
  if (obj.contact) {
    if (obj.contact.phone) {
      obj.contact.phone = decrypt(obj.contact.phone);
    }
    if (obj.contact.address) {
      obj.contact.address = decrypt(obj.contact.address);
    }
  }
  if (Array.isArray(obj.antecedents)) {
    obj.antecedents = decryptStringArray(obj.antecedents);
  }
  if (Array.isArray(obj.allergies)) {
    obj.allergies = decryptStringArray(obj.allergies);
  }
  if (Array.isArray(obj.traitements)) {
    obj.traitements = decryptStringArray(obj.traitements);
  }
  if (obj.notes) {
    obj.notes = decrypt(obj.notes);
  }

  return obj;
}

patientSchema.pre('validate', function normalizeCinBeforeValidate() {
  if (this.cin && !isEncrypted(this.cin)) {
    this.cin = String(this.cin).trim().toUpperCase();
    this.cinHash = hashValue(this.cin);
  }
});

patientSchema.pre('save', function encryptSensitiveFieldsBeforeSave() {
  if (this.cin && !isEncrypted(this.cin)) {
    const normalizedCin = String(this.cin).trim().toUpperCase();
    this.cinHash = hashValue(normalizedCin);
    this.cin = encrypt(normalizedCin);
  }
  if (this.contact) {
    if (this.contact.phone && !isEncrypted(this.contact.phone)) {
      this.contact.phone = encrypt(this.contact.phone);
    }
    if (this.contact.address && !isEncrypted(this.contact.address)) {
      this.contact.address = encrypt(this.contact.address);
    }
  }
  if (Array.isArray(this.antecedents)) {
    this.antecedents = encryptStringArray(this.antecedents);
  }
  if (Array.isArray(this.allergies)) {
    this.allergies = encryptStringArray(this.allergies);
  }
  if (Array.isArray(this.traitements)) {
    this.traitements = encryptStringArray(this.traitements);
  }
  if (this.notes && !isEncrypted(this.notes)) {
    this.notes = encrypt(this.notes);
  }
});

patientSchema.post('init', function decryptSensitiveFieldsOnInit(doc) {
  decryptPatientObject(doc);
});

function cleanTransform(_doc, ret) {
  decryptPatientObject(ret);
  delete ret.cinHash;
  delete ret.__v;
  return ret;
}

patientSchema.set('toJSON', { transform: cleanTransform });
patientSchema.set('toObject', { transform: cleanTransform });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = {
  Patient,
  GENDERS,
  BLOOD_GROUPS,
  CIN_REGEX,
  decryptPatientObject
};
