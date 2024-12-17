const badRequest = require('./badRequest');
const forbidden = require('./forbidden');
const notFound = require('./notFound');
const unAuthorized = require('./unAuthorized');
const conflict = require('./conflict');

module.exports = {
  badRequest,
  notFound,
  unAuthorized,
  forbidden,
  conflict,
};
