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

module.exports = {
  register
};
