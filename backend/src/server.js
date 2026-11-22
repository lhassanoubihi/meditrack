const app = require('./app');
const env = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/database');

async function startServer() {
  try {
    await connectDatabase(env.mongoUri);
    console.log('Connected to MongoDB');

    const server = app.listen(env.port, () => {
      console.log(`MediTrack API running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
