import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors/index.js";
import Review from "../models/review.js";

const getReviewForProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.findAll({ where: { productId } });

    if (!reviews.length) {
      throw new NotFoundError("No reviews found for this product.");
    }
    res.status(StatusCodes.OK).json({ reviews });
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const review = await Review.findByPk(id);

    if (!review) {
      throw new NotFoundError("Review not found");
    }
    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    next(error);
  }
};

const getUserReviews = async (req, res, next) => {
  const {
    user: { userId },
  } = req;
  try {
    const reviews = await Review.findAll({ where: { userId } });

    if (!reviews.length) {
      throw new NotFoundError("No reviews found for this user");
    }
    res.status(StatusCodes.OK).json({ reviews });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  const {
    user: { userId },
    body: { productId, rating, comment },
  } = req;

  if (!productId && !rating && !comment) {
    throw new BadRequestError("Product ID, rating, and comment are required");
  }

  try {
    const newReview = await Review.create({
      userId,
      productId,
      rating,
      comment,
      isVerified: true,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Review created successfully", newReview });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    await review.update({ rating, comment });

    res
      .status(StatusCodes.OK)
      .json({ message: "Review updated successfully", review });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    await review.destroy();
    res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getReviewById,
  getReviewForProduct,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
};
