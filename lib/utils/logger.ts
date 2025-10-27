import { createLogger, format, transports } from 'winston';
import path from 'path';
import * as styles from './terminal-styles';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Custom formatter using our terminal styles
const customFormatter = format.printf(({ level, message, timestamp }) => {
  const timestampStr = styles.secondary(timestamp);
  
  switch (level) {
    case 'error':
      return `${timestampStr} ${styles.error('ERROR')} ${message}`;
    case 'warn':
      return `${timestampStr} ${styles.userInput('WARN')} ${message}`;
    case 'info':
      return `${timestampStr} ${styles.success('INFO')} ${message}`;
    case 'http':
      return `${timestampStr} ${styles.codex('HTTP')} ${message}`;
    case 'debug':
      return `${timestampStr} ${styles.secondary('DEBUG')} ${message}`;
    default:
      return `${timestampStr} ${message}`;
  }
});

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  customFormatter
);

// Create the logger
const logger = createLogger({
  levels,
  format: logFormat,
  transports: [
    // Console transport with custom formatting
    new transports.Console(),
    
    // File transport - Error logs (without colors)
    new transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => 
          `${timestamp} ${level.toUpperCase()}: ${message}`
        )
      )
    }),
    
    // File transport - All logs (without colors)
    new transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => 
          `${timestamp} ${level.toUpperCase()}: ${message}`
        )
      )
    }),
  ],
});

// Create directory for logs if it doesn't exist
import fs from 'fs';
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Export logging functions with styled output
export const logError = (message: string, error?: Error) => {
  const errorMessage = error 
    ? `${message}\n${styles.error('Error:')} ${error.message}\n${styles.secondary('Stack:')} ${error.stack}`
    : message;
  logger.error(errorMessage);
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

// Performance monitoring with styled output
export const logPerformance = (operation: string, startTime: number) => {
  const duration = Date.now() - startTime;
  const durationStr = styles.success(`${duration}ms`);
  logger.info(`Performance - ${styles.header(operation)}: ${durationStr}`);
};

// Status indicators
export const logStatus = (message: string, type: 'success' | 'error' | 'info') => {
  logger.info(styles.status(message, type));
};

// Export default logger for advanced usage
export default logger;