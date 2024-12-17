const CustomError = require('../utils/customError');
const { StatusCodes } = require('http-status-codes');

const conflict = (message) => {
  return new CustomError(message, StatusCodes.CONFLICT);
};

module.exports = conflict;
