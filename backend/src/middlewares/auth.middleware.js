const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { AppError } = require('./errorHandler.middleware');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentification requise : token Bearer manquant', 401));
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return next(new AppError('Authentification requise : token vide', 401));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role
    };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Session expirée : token JWT expiré', 401));
    }
    return next(new AppError('Token d\'authentification invalide', 401));
  }
}

function authorize(...allowedRoles) {
  const normalizedRoles = allowedRoles
    .flat()
    .filter((role) => typeof role === 'string' && role.trim().length > 0)
    .map((role) => role.trim().toLowerCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Authentification requise pour vérifier les droits d\'accès', 401));
    }

    const userRole = String(req.user.role).trim().toLowerCase();
    if (!normalizedRoles.includes(userRole)) {
      return next(
        new AppError(
          `Accès refusé : rôle '${userRole}' non autorisé pour cette ressource`,
          403
        )
      );
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize
};
