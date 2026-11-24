const mongoose = require('mongoose');
const { User, ROLES, EMAIL_REGEX } = require('../models/User.model');
const { STRONG_PASSWORD_REGEX, sanitizeUser } = require('./auth.service');
const { AppError } = require('../middlewares/errorHandler.middleware');

async function listUsers(query = {}) {
  const filter = {};

  if (query.role && ROLES.includes(query.role)) {
    filter.role = query.role;
  }

  if (query.isActive === 'true' || query.isActive === true) {
    filter.isActive = true;
  } else if (query.isActive === 'false' || query.isActive === false) {
    filter.isActive = false;
  }

  if (typeof query.search === 'string' && query.search.trim()) {
    const regex = new RegExp(query.search.trim(), 'i');
    filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }, { specialite: regex }];
  }

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter)
  ]);

  return {
    users: users.map(sanitizeUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

async function getUserById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Identifiant utilisateur invalide', 400);
  }
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }
  return sanitizeUser(user);
}

async function createStaffUser(payload = {}) {
  const errors = [];
  const firstName = typeof payload.firstName === 'string' ? payload.firstName.trim() : '';
  const lastName = typeof payload.lastName === 'string' ? payload.lastName.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';
  const role = typeof payload.role === 'string' ? payload.role.trim().toLowerCase() : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const specialite = typeof payload.specialite === 'string' ? payload.specialite.trim() : '';

  if (firstName.length < 2) errors.push('Le prénom doit contenir au moins 2 caractères');
  if (lastName.length < 2) errors.push('Le nom doit contenir au moins 2 caractères');
  if (!EMAIL_REGEX.test(email)) errors.push('Adresse email invalide');
  if (!STRONG_PASSWORD_REGEX.test(password)) {
    errors.push(
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
    );
  }
  if (!ROLES.includes(role)) {
    errors.push(`Rôle invalide. Rôles autorisés : ${ROLES.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new AppError('Données utilisateur invalides', 400, errors);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Un compte avec cette adresse email existe déjà', 409);
  }

  const created = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
    specialite,
    isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true
  });

  return sanitizeUser(created);
}

async function updateUser(id, payload = {}) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Identifiant utilisateur invalide', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  if (payload.firstName !== undefined) {
    const val = String(payload.firstName).trim();
    if (val.length < 2) throw new AppError('Le prénom doit contenir au moins 2 caractères', 400);
    user.firstName = val;
  }
  if (payload.lastName !== undefined) {
    const val = String(payload.lastName).trim();
    if (val.length < 2) throw new AppError('Le nom doit contenir au moins 2 caractères', 400);
    user.lastName = val;
  }
  if (payload.role !== undefined) {
    const roleVal = String(payload.role).trim().toLowerCase();
    if (!ROLES.includes(roleVal)) throw new AppError('Rôle utilisateur invalide', 400);
    user.role = roleVal;
  }
  if (payload.phone !== undefined) user.phone = String(payload.phone).trim();
  if (payload.specialite !== undefined) user.specialite = String(payload.specialite).trim();
  if (payload.isActive !== undefined) user.isActive = Boolean(payload.isActive);

  await user.save();
  return sanitizeUser(user);
}

async function updateUserStatus(id, isActive, actorId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Identifiant utilisateur invalide', 400);
  }
  if (typeof isActive !== 'boolean') {
    throw new AppError('Le champ isActive (booléen) est obligatoire', 400);
  }
  if (actorId && String(id) === String(actorId) && isActive === false) {
    throw new AppError('Un administrateur ne peut pas désactiver son propre compte', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  user.isActive = isActive;
  await user.save();
  return sanitizeUser(user);
}

async function deleteUser(id, actorId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Identifiant utilisateur invalide', 400);
  }
  if (actorId && String(id) === String(actorId)) {
    throw new AppError('Un administrateur ne peut pas supprimer son propre compte', 400);
  }

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError('Utilisateur introuvable', 404);
  }
  return sanitizeUser(deleted);
}

module.exports = {
  listUsers,
  getUserById,
  createStaffUser,
  updateUser,
  updateUserStatus,
  deleteUser
};
