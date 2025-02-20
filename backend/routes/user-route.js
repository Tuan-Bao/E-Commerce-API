import express from "express";
import * as userController from "../controllers/user-controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", auth, userController.logout);

router.get("/", auth, userController.getUser);
router.patch("/", auth, userController.updateUser);
router.delete("/", auth, userController.deleteUser);

export default router;
