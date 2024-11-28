const badRequest = require("./badRequest");
const forbidden = require("./forbidden");
const notFound = require("./notFound");
const unAuthorized = require("./unAuthorized");

module.exports = {
  badRequest,
  notFound,
  unAuthorized,
  forbidden,
};