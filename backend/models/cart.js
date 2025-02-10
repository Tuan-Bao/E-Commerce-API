import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    modelName: "carts",
    sequelize,
  }
);

class CartItem extends Model {}

CartItem.init(
  {
    cartId: {
      type: DataTypes.INTEGER,
      references: {
        model: Cart,
        key: "id",
      },
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: "products",
        key: "id",
      },
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    modelName: "cartItems",
    sequelize,
  }
);

export { Cart, CartItem };
