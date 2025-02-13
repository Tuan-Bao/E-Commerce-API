import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/not-found";
import User from "../models/user";

const getAllCustomers = async (req, res, next) => {
  try {
    const users = await User.findAll({ where: { role: "Admin" } });
    if (!users) {
      throw new NotFoundError("No users was found");
    }
    res.status(StatusCodes.OK).json({ users, "num of users: ": users.length });
  } catch (error) {
    next(error);
  }
};

const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.findAll({ where: { role: "Admin" } });
    if (!admins) {
      throw new NotFoundError("No admins was found");
    }
    res
      .status(StatusCodes.OK)
      .json({ admins, "num of admins: ": admins.length });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const { userId } = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { userId } = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await user.update({ ...req.body });
    res
      .status(StatusCodes.OK)
      .json({ message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { userId } = req.params.userId;
  try {
    const count = await User.destroy(userId);
    if (!count) {
      throw new NotFoundError("User not found");
    }
    res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports = { getAllCustomers, getAllAdmins, getUser, updateUser, deleteUser };
