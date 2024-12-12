const { StatusCodes, ReasonPhrases } = require('http-status-codes');
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
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: true,
    message: err || err.message,
    status: 500,
  });
};
