const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User, EMAIL_REGEX } = require('../models/User.model');
const { AppError } = require('../middlewares/errorHandler.middleware');

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function sanitizeUser(user) {
  if (!user) {
    return null;
  }
  const obj = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.__v;
  return obj;
}

function generateToken(user) {
  const payload = {
    sub: String(user._id || user.id),
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

function validateRegistrationPayload(payload = {}) {
  const errors = [];
  const firstName = typeof payload.firstName === 'string' ? payload.firstName.trim() : '';
  const lastName = typeof payload.lastName === 'string' ? payload.lastName.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';

  if (firstName.length < 2) {
    errors.push('Le prénom doit contenir au moins 2 caractères');
  }
  if (lastName.length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.push('Adresse email invalide');
  }
  if (!STRONG_PASSWORD_REGEX.test(password)) {
    errors.push(
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { firstName, lastName, email, password, phone }
  };
}

async function registerPatient(payload) {
  const { isValid, errors, data } = validateRegistrationPayload(payload);

  if (!isValid) {
    throw new AppError('Données d\'inscription invalides', 400, errors);
  }

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError('Un compte avec cette adresse email existe déjà', 409);
  }

  const createdUser = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    phone: data.phone,
    role: 'patient'
  });

  return sanitizeUser(createdUser);
}

async function loginUser(payload = {}) {
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!email || !password) {
    throw new AppError('Email et mot de passe sont obligatoires', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  if (user.isActive === false) {
    throw new AppError('Ce compte a été désactivé. Veuillez contacter un administrateur.', 403);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  const token = generateToken(user);

  return {
    token,
    user: sanitizeUser(user)
  };
}

module.exports = {
  STRONG_PASSWORD_REGEX,
  sanitizeUser,
  generateToken,
  validateRegistrationPayload,
  registerPatient,
  loginUser
};
