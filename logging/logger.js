/**
 * GradPath — Winston Logger
 * Structured logging with file rotation and audit-grade output.
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../backend/config');

// Ensure log directory exists
const logDir = path.resolve(config.logging.dir);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'gradpath' },
  transports: [
    // Combined log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
    // Error log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    // Security / audit log
    new winston.transports.File({
      filename: path.join(logDir, 'security.log'),
      level: 'info',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    }),
  ],
});

// Console output in non-production
if (config.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

/**
 * Create a child logger scoped to a specific module.
 */
logger.child = (meta) =>
  winston.createLogger({
    level: logger.level,
    format: logFormat,
    defaultMeta: { service: 'gradpath', ...meta },
    transports: logger.transports,
  });

module.exports = logger;
