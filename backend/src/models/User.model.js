const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = Object.freeze([
  'admin',
  'medecin',
  'infirmier',
  'patient',
  'pharmacien'
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Le prénom est obligatoire'],
      trim: true,
      minlength: [2, 'Le prénom doit contenir au moins 2 caractères'],
      maxlength: [60, 'Le prénom ne peut pas dépasser 60 caractères']
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
      maxlength: [60, 'Le nom ne peut pas dépasser 60 caractères']
    },
    email: {
      type: String,
      required: [true, 'L\'adresse email est obligatoire'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Format d\'adresse email invalide']
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: 'Rôle utilisateur invalide : {VALUE}'
      },
      default: 'patient'
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    specialite: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      select: false,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function hashPasswordBeforeSave() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  if (!candidatePassword || !this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

function sanitizeTransform(_doc, ret) {
  delete ret.password;
  delete ret.twoFactorSecret;
  delete ret.__v;
  return ret;
}

userSchema.set('toJSON', { transform: sanitizeTransform });
userSchema.set('toObject', { transform: sanitizeTransform });

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  ROLES,
  EMAIL_REGEX
};
