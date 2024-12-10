const CustomError = require('../utils/customError');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const forbidden = (message) => {
  return new CustomError(
    message || ReasonPhrases.FORBIDDEN,
    StatusCodes.FORBIDDEN,
  );
};

module.exports = forbidden;
