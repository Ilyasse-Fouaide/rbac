const { StatusCodes } = require('http-status-codes');
const CustomError = require('../utils/customError');

module.exports = (err, req, res, _next) => {
  if (err instanceof CustomError) {
    return res
      .status(err.status)
      .json({ message: err.message, status: err.status });
  }

  if (err.name && err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(({ path, message }) => {
      return { [path]: message };
    });

    const message = Object.assign({}, ...errors);

    return res.status(StatusCodes.BAD_REQUEST).json(message);
  }

  if (err.code && err.code === 11000) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `${Object.keys(err.keyValue)} is already used` });
  }

  if (err.name && err.name === 'JsonWebTokenError') {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message });
  }

  if (err.code && err.code === 'ENOENT') {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: `${err.path} not found`,
    });
  }

  if (err.name && err.name === 'MulterError') {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'File is too large. Please upload a file smaller than 5MB.',
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Unexpected file type. Please upload the correct file.',
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Too many files uploaded. Please upload only one file.',
        });
      default:
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: `An unexpected error occurred during file upload: ${err.message}`,
        });
    }
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: true,
    message: err || err.message,
    status: 500,
  });
};
