import express from "express";
import * as reviewController from "../controllers/review-controller.js";

const router = express.Router();

router.get("/:productId", reviewController.getReviewForProduct);
router.get("/:id", reviewController.getReviewById);
router.get("/", reviewController.getUserReviews);
router.post("/", reviewController.createReview);
router.patch("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
