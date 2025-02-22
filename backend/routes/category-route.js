import express from "express";
import * as categoryController from "../controllers/category-controller.js";
import auth from "../middleware/authentication.js";
import adminAuth from "../middleware/admin-authorization.js";

const router = express.Router();

// user
router.get("/", categoryController.getAllCategories);
router.get("/:categoryId", categoryController.getCategory);

// admin
router.post("/", auth, adminAuth, categoryController.createCategory);
router.patch(
  "/:categoryId",
  auth,
  adminAuth,
  categoryController.updateCategory
);
router.delete(
  "/:categoryId",
  auth,
  adminAuth,
  categoryController.deleteCategory
);

export default router;
