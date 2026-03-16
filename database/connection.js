/**
 * GradPath — Database Connection
 * Manages Mongoose connection with retry logic.
 */

const mongoose = require('mongoose');
const config = require('../backend/config');
const logger = require('../logging/logger');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(config.db.uri, config.db.options);
    isConnected = true;
    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB disconnected');
    });
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err.message });
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
}

async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB disconnected gracefully');
}

module.exports = { connectDB, disconnectDB };
