import { createLogger, format, transports } from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.colorize({ all: true }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create the logger
const logger = createLogger({
  levels,
  format: logFormat,
  transports: [
    // Console transport
    new transports.Console(),
    
    // File transport - Error logs
    new transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
    }),
    
    // File transport - All logs
    new transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
    }),
  ],
});

// Create directory for logs if it doesn't exist
import fs from 'fs';
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Export logging functions
export const logError = (message: string, error?: Error) => {
  logger.error(`${message} ${error ? `\nError: ${error.message}\nStack: ${error.stack}` : ''}`);
};

export const logWarning = (message: string) => {
  logger.warn(message);
};

export const logInfo = (message: string) => {
  logger.info(message);
};

export const logHttp = (message: string) => {
  logger.http(message);
};

export const logDebug = (message: string) => {
  logger.debug(message);
};

// Performance monitoring
export const logPerformance = (operation: string, startTime: number) => {
  const duration = Date.now() - startTime;
  logger.info(`Performance - ${operation}: ${duration}ms`);
};

// Export default logger for advanced usage
export default logger;