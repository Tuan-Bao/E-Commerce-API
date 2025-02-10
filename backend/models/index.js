import sequelize from "../config/database.js";
import { Cart, CartItem } from "./cart.js";
import Category from "./category.js";
import Product from "./product.js";
import User from "./user.js";
import Review from "./review.js";

Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasOne(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Review, { foreignKey: "productId" });
Review.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("All tables created or already exist");
  } catch (error) {
    console.error(`Error syncing models: ${error}`);
  }
};

syncDatabase();

export { User, Cart, Product, Category, syncDatabase };
