const CustomError = require("../utils/customError")
const { ReasonPhrases, StatusCodes } = require("http-status-codes")

const unAuthorized = (message) => {
  return new CustomError(message || ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
}

module.exports = unAuthorized;
