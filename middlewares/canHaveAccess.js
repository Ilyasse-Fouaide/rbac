const RBAC = require('../utils/rbac');
const Error = require('../custom-error');

const canHaveAccess = async (req, res, next) => {
  try {
    const requestingUserId = req.user.userId;
    const { userId } = req.params;

    // Check if user who trying to made action is his own account
    const owner = userId === requestingUserId;

    const isAdmin = await RBAC.isAdmin(requestingUserId);

    if (!isAdmin && !owner) {
      return next(Error.unAuthorized('Permission denied'));
    }

    next();
  } catch (error) {
    next(Error.badRequest(error.message));
  }
};

module.exports = canHaveAccess;
