const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
require('winston-loggly-bulk');

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  format: combine(
    colorize(), // Colorize the output
    timestamp(), // Add timestamp to log messages
    logFormat // Apply custom log format
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
    new transports.File({ filename: 'logs/combined.log' }), // Log all messages to file
  ],
});

// Add Loggly transport if in production
if (process.env.NODE_ENV === 'production' && process.env.LOGGLY_TOKEN && process.env.LOGGLY_SUBDOMAIN) {
  logger.add(new transports.Loggly({
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
    tags: ['Winston-NodeJS'],
    json: true,
  }));
}

module.exports = logger;