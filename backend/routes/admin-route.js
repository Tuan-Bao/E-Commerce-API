import express from "express";
import * as adminController from "../controllers/admin-controller.js";

const router = express.Router();

router.get("/customers", adminController.getAllCustomers);
router.get("/admins", adminController.getAllAdmins);
router.get("/:userId", adminController.getUser);
router.patch("/:userId", adminController.updateUser);
router.delete("/:userId", adminController.deleteUser);

export default router;
