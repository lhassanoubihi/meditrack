const patientService = require('../services/patient.service');

async function create(req, res, next) {
  try {
    const patient = await patientService.createPatient(req.body, req.user.id);
    return res.status(201).json({
      status: 'success',
      message: 'Dossier patient créé avec succès',
      data: { patient }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create
};
