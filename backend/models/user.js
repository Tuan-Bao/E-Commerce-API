import sequelize from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DataTypes, Model, Sequelize } from "sequelize";
import { configDotenv } from "dotenv";

configDotenv();

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Username already exists. Please choose a different one",
      },
      validate: {
        notNull: {
          msg: "Please enter a username",
        },
        len: {
          args: [3, 50],
          msg: "Username must be between 3 and 50 characters long",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists. Please choose a different one",
      },
      validate: {
        notNull: {
          msg: "Please enter a email",
        },
        isEmail: {
          args: true,
          msg: "Please enter a valid email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter a password",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("User", "Admin"),
      allowNull: false,
      defaultValue: "User",
      validate: {
        isIn: {
          args: [["User", "Admin"]],
          msg: "Role must be either 'User' or 'Admin'",
        },
      },
    },
  },
  {
    modelName: "users",
    sequelize,
    timestamps: true,
  }
);

User.beforeSave(async (user) => {
  if (user.changed("password")) {
    const value = user.password;

    if (value.length < 8 || value.length > 32) {
      throw new Sequelize.ValidationError(
        "Password must be between 8 and 32 characters."
      );
    }

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?\/\\|-]/.test(value);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      throw new Sequelize.ValidationError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.prototype.createJWT = function () {
  console.log(process.env.JWT_SECRET);
  return jwt.sign(
    { id: this.id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

User.prototype.comparePassword = async function (cadidatePassword) {
  const isMatch = await bcrypt.compare(cadidatePassword, this.password);
  return isMatch;
};

export default User;
