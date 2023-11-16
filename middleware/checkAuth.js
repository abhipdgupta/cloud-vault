const { getjwt } = require("../utils/jwt");
const {Role}=require('../utils/constant');
const { getUserById } = require("../service/user");
const ErrorHandler = require("../utils/errorHandler");

const requireUserAccess = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) throw new ErrorHandler("No Token Provided", 401);

    const token = headerToken.split(" ")[1];

    const { id } = await getjwt(token);

    const user = await getUserById(id);

    if (!user || user.role === Role.ADMIN)
      throw new ErrorHandler("Unauthorized", 401);

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in requireUserAccess", error);
    next(error);
  }
};

const requireAdminAccess = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) throw new ErrorHandler("No Token Provided", 401);
    const token = headerToken.split(" ")[1];

    const { id } = await getjwt(token);

    const user = await getUserById(id);

    if (!user || user.role !== Role.ADMIN)
      throw new ErrorHandler("Unauthorized", 401);

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in requireUserAccess", error);
    next(error);
  }
};

module.exports = {
  requireAdminAccess,
  requireUserAccess,
};
