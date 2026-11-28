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

async function list(req, res, next) {
  try {
    const result = await patientService.listPatients({
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
      includeArchived: req.query.includeArchived
    });
    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    return next(err);
  }
}

async function getMine(req, res, next) {
  try {
    const patient = await patientService.getPatientByUser(req.user);
    return res.status(200).json({
      status: 'success',
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

async function archive(req, res, next) {
  try {
    const patient = await patientService.archivePatient(req.params.id, req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'Dossier patient archivé avec succès',
      data: { patient }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  getMine,
  getById,
  update,
  archive
};
