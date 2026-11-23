const { User, ROLES } = require('./User.model');

/**
 * Central registry for MediTrack Mongoose domain models.
 * - Sprint 1: User
 * - Sprint 2: Patient, AuditLog
 * - Sprint 3: Disponibilite, RendezVous
 * - Sprint 4: Consultation, Ordonnance, Medicament
 */
module.exports = {
  User,
  ROLES
};
