const healthService = require('../services/health.service');

function getHealth(req, res) {
  const payload = healthService.getHealthStatus();
  return res.status(200).json(payload);
}

module.exports = {
  getHealth
};
