import Sequelize from "sequelize";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });

console.log("Environment variables loaded:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

// Tạo kết nối sequelize với MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5, // Số kết nối tối đa
      min: 0, // Số kết nối tối thiểu
      acquire: 30000, // Số kết nối tối thiểu
      idle: 10000, // Thời gian idle tối đa (ms)
    },
  }
);

// Kiểm tra kết nối
(async () => {
  try {
    console.log("Connect db successfully !");
  } catch (error) {
    console.error(error);
  }
})();

export default sequelize;
