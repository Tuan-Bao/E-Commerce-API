import User from "../models/user.js";
import { UnauthorizedError } from "../errors/index.js";

const adminAuth = async (req, res, next) => {
  const { userId } = req.user;

  const user = await User.findByPk(userId);

  if (user.role !== "Admin") {
    throw new UnauthorizedError("Access denied. Admins only.");
  } else {
    next();
  }
};

export default adminAuth;
