import express from "express";
import * as reviewController from "../controllers/review-controller.js";
import auth from "../middleware/authentication.js";

const router = express.Router();

router.get("/:productId", reviewController.getReviewForProduct);
router.get("/id/:id", reviewController.getReviewById);
router.get("/", auth, reviewController.getUserReviews);
router.post("/", auth, reviewController.createReview);
router.patch("/:id", auth, reviewController.updateReview);
router.delete("/:id", auth, reviewController.deleteReview);

export default router;
