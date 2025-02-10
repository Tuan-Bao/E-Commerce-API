import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "categories",
    sequelize,
    timestamps: true,
  }
);

export default Category;
