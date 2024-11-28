const Error = require("../custom-error");

module.exports = (req, res, next) => {
  next(Error.notFound(`url ${req.url} Not Found!.`));
};