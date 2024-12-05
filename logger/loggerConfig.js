const winston = require('winston');
const expressWinston = require('express-winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const os = require('os');
const fs = require('fs');
const config = require('../config');

class LoggerConfig {
  static instance;

  constructor() {
    if (!LoggerConfig.instance) {
      LoggerConfig.instance = this;
    }
    return LoggerConfig.instance;
  }

  // create log directory
  static createLogDirectory() {
    const logDir = path.join(__dirname, '..', 'logs');
    const errorDir = path.join(logDir, 'error');
    const combinedDir = path.join(logDir, 'combined');
    const requestsDir = path.join(logDir, 'requests');

    // Ensure directories exist, otherwise create them
    [logDir, errorDir, combinedDir, requestsDir].forEach((dir) => {
      const dirExists = fs.existsSync(dir);
      if (!dirExists) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`- ✅ Successfully created ${dir} directory`)
      }
    });
  }

  // Custom log format
  static createLogFormat() {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const logEntry = {
          timestamp,
          level,
          message: stack || message,
          meta: Object.keys(meta).length ? meta : undefined
        };
        return JSON.stringify(logEntry);
      })
    );
  }

  static createLogger() {
    // create [logs, error, combined, requestsDir] directories
    this.createLogDirectory();

    return winston.createLogger({
      level: config.LOG_LEVEL || 'info',
      format: this.createLogFormat(),
      defaultMeta: { 
        // service: process.env.SERVICE_NAME || 'default-service',
        hostname: os.hostname()
      },
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.colorize({ all: true })
        }),
        
        // File transport for error logs
        new DailyRotateFile({
          filename: path.join(__dirname, '..', 'logs', 'error', 'error-%DATE%.log'),
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        
        // Combined log file
        new DailyRotateFile({
          filename: path.join(__dirname, '..', 'logs', 'combined', 'combined-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: 10485760, // 10MB
          maxFiles: 10
        }),
      ],
      exceptionHandlers: [
        new DailyRotateFile({
          filename: path.join(__dirname, '..', 'logs', 'error', 'exceptions-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
        })
      ],
      rejectionHandlers: [
        new DailyRotateFile({
          filename: path.join(__dirname, '..', 'logs', 'error', 'rejections-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
        })
      ]
    });
  }

  static createRequestLogger() {
    return expressWinston.logger({
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: path.join(__dirname, '..', 'logs', 'requests', 'requests-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxsize: 5242880, // 5MB
          maxFiles: 5
        })
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
      meta: true,
      colorize: false,
      requestWhitelist: ['url', 'method', 'originalUrl', 'query', 'body'],
      responseWhitelist: ['statusCode', 'body'],
      dynamicMeta: (req, res) => ({
        user: req.user || null,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })
    });
  }

  // Error logging middleware
  static createRequestErrorLogger() {
    return expressWinston.errorLogger({
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: path.join(__dirname, '..', 'logs', 'requests', 'express-errors-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxsize: 5242880, // 5MB
          maxFiles: 5
        })
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      )
    });
  }
}

module.exports = LoggerConfig;
