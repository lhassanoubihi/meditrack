const mongoose = require('mongoose');

const AUDIT_ACTIONS = Object.freeze([
  'PATIENT_LIST',
  'PATIENT_VIEW',
  'PATIENT_VIEW_SELF',
  'PATIENT_CREATE',
  'PATIENT_UPDATE',
  'PATIENT_ARCHIVE',
  'AUDIT_LOGS_VIEW'
]);

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    resource: {
      type: String,
      required: true,
      trim: true,
      default: 'Patient',
      index: true
    },
    resourceId: {
      type: String,
      default: null,
      index: true
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    actorEmail: {
      type: String,
      trim: true,
      default: ''
    },
    actorRole: {
      type: String,
      trim: true,
      default: '',
      index: true
    },
    method: {
      type: String,
      required: true,
      uppercase: true
    },
    path: {
      type: String,
      required: true
    },
    statusCode: {
      type: Number,
      required: true
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

auditLogSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = {
  AuditLog,
  AUDIT_ACTIONS
};
