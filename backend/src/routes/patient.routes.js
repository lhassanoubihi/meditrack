const express = require('express');
const patientController = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize('admin', 'medecin', 'infirmier'),
  patientController.create
);

module.exports = router;
