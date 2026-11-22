class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';
  let details = err.details || undefined;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Erreur de validation des données';
    details = Object.values(err.errors || {}).map((e) => e.message);
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Identifiant invalide pour le champ ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {});
    message = fields.length
      ? `Conflit : valeur déjà existante (${fields.join(', ')})`
      : 'Conflit : ressource déjà existante';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token d\'authentification invalide ou expiré';
  }

  const response = {
    status: 'error',
    message
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  AppError,
  errorHandler
};
