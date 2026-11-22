require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/meditrack',
  frontendUrl: process.env.FRONTEND_URL || '*',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  twoFaIssuer: process.env.TWO_FA_ISSUER || 'MediTrack-ENSAM'
};

module.exports = env;
