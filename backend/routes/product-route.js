import express from "express";
import * as productController from "../controllers/product-controller.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/admin-authorization.js";

const router = express.Router();

// admin only
router.post("/", auth, adminAuth, productController.createProduct);
router.patch("/:productId", auth, adminAuth, productController.updateProduct);
router.delete("/:productId", auth, adminAuth, productController.deleteProduct);

// all users
router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getProduct);

export default router;
