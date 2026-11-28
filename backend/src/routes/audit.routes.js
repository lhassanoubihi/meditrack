const express = require('express');
const auditController = require('../controllers/audit.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticate, authorize('admin'), auditController.list);

module.exports = router;
