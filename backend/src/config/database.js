const mongoose = require('mongoose');
const env = require('./env');

const READY_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

async function connectDatabase(uri = env.mongoUri) {
  return mongoose.connect(uri);
}

async function disconnectDatabase() {
  return mongoose.disconnect();
}

function getDatabaseStatus() {
  return READY_STATES[mongoose.connection.readyState] || 'unknown';
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus
};
