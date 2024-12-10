const LoggerConfig = require('./loggerConfig');

class Logger {
  static logger = LoggerConfig.createLogger();

  static info(message, ...meta) {
    this.logger.info(message, ...meta);
  }
  
  static error(message, ...meta) {
    this.logger.error(message, ...meta);
  }

  static warn(message, ...meta) {
    this.logger.warn(message, ...meta);
  }

  static debug(message, ...meta) {
    this.logger.debug(message, ...meta);
  }

  static requestLogger() {
    return LoggerConfig.createRequestLogger();
  }

  static errorLogger() {
    return LoggerConfig.createRequestErrorLogger();
  }
}

module.exports = Logger;
