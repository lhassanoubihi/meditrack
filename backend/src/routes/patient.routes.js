const express = require('express');
const patientController = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  patientController.list
);

router.post(
  '/',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  patientController.create
);

router.get(
  '/:id',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  patientController.getById
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  patientController.update
);

router.patch(
  '/:id/archive',
  authenticate,
  authorize('admin', 'medecin'),
  patientController.archive
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'medecin'),
  patientController.archive
);

module.exports = router;
