const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const user = await authService.registerPatient(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Compte patient créé avec succès',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { token, user } = await authService.loginUser(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Connexion réussie',
      data: { token, user }
    });
  } catch (err) {
    return next(err);
  }
}

function me(req, res) {
  return res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
}

module.exports = {
  register,
  login,
  me
};
