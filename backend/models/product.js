import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Product extends Model {}

Product.init(
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
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    modelName: "products",
    sequelize,
    timestamps: true,
  }
);

export default Product;
