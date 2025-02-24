import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";
import { configDotenv } from "dotenv";

configDotenv();

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(payload);
    req.user = { userId: payload.id, username: payload.username };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export default auth;
