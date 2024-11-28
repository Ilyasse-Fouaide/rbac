const CustomError = require('../utils/customError');
const { StatusCodes } = require('http-status-codes');

const notFound = (message) => {
  return new CustomError(message, StatusCodes.NOT_FOUND);
};

module.exports = notFound;
