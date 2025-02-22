import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";

import userRoute from "./routes/user-route.js";
import adminRoute from "./routes/admin-route.js";
import productRoute from "./routes/product-route.js";
import categoryRoute from "./routes/category-route.js";
import cartRoute from "./routes/cart-route.js";
import reviewRoute from "./routes/review-route.js";

import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handle.js";

configDotenv();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/review", reviewRoute);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = 4000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
