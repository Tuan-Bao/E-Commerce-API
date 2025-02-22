import express from "express";
import * as cartController from "../controllers/cart-controller.js";
import * as cartItemController from "../controllers/cartitem-controller.js";
import auth from "../middleware/authentication.js";

const router = express.Router();

// cart routes
router.post("/", auth, cartController.createCart);
router.get("/", auth, cartController.getCart);
router.delete("/", auth, cartController.deleteCart);

// cart item routes
router.post("/item", auth, cartItemController.createCartItem);
router.get("/item/:itemId", auth, cartItemController.getCartItem);
router.patch("/item/:itemId", auth, cartItemController.updateCartItem);
router.delete("/item/:itemId", auth, cartItemController.deleteCartItem);
router.delete("/item", auth, cartItemController.clearCartItem);

export default router;
