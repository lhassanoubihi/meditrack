const mongoose = require('mongoose');
const { AuditLog } = require('../models/AuditLog.model');
const { AppError } = require('../middlewares/errorHandler.middleware');

async function listAuditLogs(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};

  if (typeof query.action === 'string' && query.action.trim()) {
    filter.action = query.action.trim().toUpperCase();
  }
  if (typeof query.resource === 'string' && query.resource.trim()) {
    filter.resource = query.resource.trim();
  }
  if (typeof query.resourceId === 'string' && query.resourceId.trim()) {
    filter.resourceId = query.resourceId.trim();
  }
  if (typeof query.actorRole === 'string' && query.actorRole.trim()) {
    filter.actorRole = query.actorRole.trim().toLowerCase();
  }
  if (typeof query.actorId === 'string' && query.actorId.trim()) {
    if (!mongoose.Types.ObjectId.isValid(query.actorId.trim())) {
      throw new AppError('Identifiant acteur (actorId) invalide', 400);
    }
    filter.actorId = query.actorId.trim();
  }

  if (query.from || query.to) {
    filter.timestamp = {};
    if (query.from) {
      const fromDate = new Date(query.from);
      if (Number.isNaN(fromDate.getTime())) {
        throw new AppError('Paramètre de date "from" invalide', 400);
      }
      filter.timestamp.$gte = fromDate;
    }
    if (query.to) {
      const toDate = new Date(query.to);
      if (Number.isNaN(toDate.getTime())) {
        throw new AppError('Paramètre de date "to" invalide', 400);
      }
      filter.timestamp.$lte = toDate;
    }
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit),
    AuditLog.countDocuments(filter)
  ]);

  return {
    logs: logs.map((doc) => (typeof doc.toJSON === 'function' ? doc.toJSON() : doc)),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

module.exports = {
  listAuditLogs
};
