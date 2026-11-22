const env = require('../config/env');
const { getDatabaseStatus } = require('../config/database');

function getHealthStatus() {
  return {
    status: 'ok',
    service: 'MediTrack API',
    environment: env.nodeEnv,
    database: getDatabaseStatus(),
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  getHealthStatus
};
