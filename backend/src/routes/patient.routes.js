const express = require('express');
const patientController = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { auditLogger } = require('../middlewares/audit.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  auditLogger('PATIENT_LIST', 'Patient'),
  patientController.list
);

router.post(
  '/',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  auditLogger('PATIENT_CREATE', 'Patient'),
  patientController.create
);

router.get(
  '/me',
  authenticate,
  authorize('patient'),
  auditLogger('PATIENT_VIEW_SELF', 'Patient'),
  patientController.getMine
);

router.get(
  '/:id',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  auditLogger('PATIENT_VIEW', 'Patient'),
  patientController.getById
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  auditLogger('PATIENT_UPDATE', 'Patient'),
  patientController.update
);

router.patch(
  '/:id/archive',
  authenticate,
  authorize('admin', 'medecin'),
  auditLogger('PATIENT_ARCHIVE', 'Patient'),
  patientController.archive
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'medecin'),
  auditLogger('PATIENT_ARCHIVE', 'Patient'),
  patientController.archive
);

module.exports = router;
