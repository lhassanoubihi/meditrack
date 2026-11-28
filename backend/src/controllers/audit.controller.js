const auditService = require('../services/audit.service');

async function list(req, res, next) {
  try {
    const result = await auditService.listAuditLogs(req.query);
    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  list
};
