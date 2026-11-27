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

async function getById(req, res, next) {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { patient }
    });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body, req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'Dossier patient mis à jour avec succès',
      data: { patient }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  getById,
  update
};
