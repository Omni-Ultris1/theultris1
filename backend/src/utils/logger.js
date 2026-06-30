const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.dirname(process.env.LOG_FILE || 'logs/app.log');
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

const transports = [
  new winston.transports.Console({
    format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
    silent: process.env.NODE_ENV === 'test',
  }),
];

// Only add file logging in development
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({
      filename: process.env.LOG_FILE || 'logs/app.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 14,
      tailable: true,
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 14,
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports,
});

module.exports = logger;
