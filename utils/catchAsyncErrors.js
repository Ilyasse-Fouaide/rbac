const Logger = require("../logger");

const catchAsyncErrors = (message, middleware) => {
  return async (req, res, next) => {
    try {
      Logger.info(message || 'Request processed', {
        path: req.path,
        method: req.method
      });

      await middleware(req, res, next);
    } catch (error) {
      Logger.error(`Failed to ${message}`, { error: error.message });
      next(error);
    }
  };
};

module.exports = catchAsyncErrors;