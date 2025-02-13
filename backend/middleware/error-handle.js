import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize";

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong, please try again",
  };

  if (err instanceof Sequelize.ValidationError) {
    customError.message = err.errors.map((error) => error.message).join(", ");
    customError.statusCode = 400;
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    customError.message = `Duplicate value entered for ${err.errors[0].path} field, please choose another value.`;
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.message = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

export default errorHandlerMiddleware;
