import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors";
import User from "../models/user.js";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new BadRequestError("Please provide all values");
    }

    const userAlreadyExists = await User.findOne({ where: { email } });
    if (userAlreadyExists) {
      throw new BadRequestError("Email already in use");
    }

    const user = await User.create({ username, email, password });
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const token = user.createJWT();
    res
      .status(StatusCodes.OK)
      .json({ user: { username: user.username }, token });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getUser = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const user = await User.findByPk(userId);
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const {
    user: { userId },
  } = req;

  await User.destroy({ where: { id: userId } });
  res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
};

const updateUser = async (req, res, next) => {
  const {
    user: { userId },
  } = req;

  try {
    const user = await User.findByPk({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (req.body.email) {
      throw new BadRequestError("Cannot update email via this endpoint.");
    }

    if (req.body.role && user.role !== "Admin" && req.body.role === "Admin") {
      throw new UnauthorizedError("Cant Modifying role. Admins only.");
    }

    await user.update({ ...req.body });

    res
      .status(StatusCodes.OK)
      .json({ message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
};

exports = { register, login, getUser, deleteUser, updateUser, logout };
