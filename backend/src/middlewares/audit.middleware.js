const mongoose = require('mongoose');
const { AuditLog } = require('../models/AuditLog.model');

function extractResourceId(req, responseBody) {
  if (req.params && req.params.id) {
    return String(req.params.id);
  }
  const patient = responseBody?.data?.patient;
  if (patient && (patient._id || patient.id)) {
    return String(patient._id || patient.id);
  }
  return null;
}

function shouldPersistAuditLog() {
  const isMocked = Boolean(AuditLog.create && AuditLog.create._isMockFunction);
  return isMocked || mongoose.connection.readyState === 1;
}

function auditLogger(action, resource = 'Patient') {
  return (req, res, next) => {
    let capturedBody = null;
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      capturedBody = body;
      return originalJson(body);
    };

    res.on('finish', () => {
      if (!shouldPersistAuditLog()) {
        return;
      }

      const actorId =
        req.user && mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : null;

      const entry = {
        action,
        resource,
        resourceId: extractResourceId(req, capturedBody),
        actorId,
        actorEmail: req.user?.email || '',
        actorRole: req.user?.role || '',
        method: req.method,
        path: req.originalUrl || req.path,
        statusCode: res.statusCode,
        ipAddress: req.ip || req.socket?.remoteAddress || '',
        userAgent: typeof req.get === 'function' ? req.get('user-agent') || '' : '',
        metadata: {
          query: req.query && Object.keys(req.query).length > 0 ? req.query : undefined
        },
        timestamp: new Date()
      };

      Promise.resolve(AuditLog.create(entry)).catch((err) => {
        if (process.env.NODE_ENV !== 'test') {
          console.error('AuditLog write error:', err.message);
        }
      });
    });

    return next();
  };
}

module.exports = {
  auditLogger,
  extractResourceId
};
