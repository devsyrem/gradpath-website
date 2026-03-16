/**
 * GradPath — Server Entry Point
 * Connects to the database and starts the Express server.
 */

const app = require('./app');
const config = require('./config');
const { connectDB } = require('../database');
const logger = require('../logging/logger');

async function start() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    const server = app.listen(config.port, () => {
      logger.info(`GradPath server running on port ${config.port} [${config.env}]`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        const { disconnectDB } = require('../database');
        await disconnectDB();
        process.exit(0);
      });
      // Force exit after 10 seconds
      setTimeout(() => process.exit(1), 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

start();
