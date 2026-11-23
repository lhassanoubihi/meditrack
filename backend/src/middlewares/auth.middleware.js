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

module.exports = {
  authenticate
};
