import { Op } from "sequelize";
import { NotFoundError, BadRequestError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import Category from "../models/category.js";

const getAllCategories = async (req, res, next) => {
  const { page, limit, search, sortBy = "id", sortOrder = "ASC" } = req.query;

  const options = {
    order: [[sortBy, sortOrder.toUpperCase()]],
  };

  if (search) {
    options.where = { name: { [Op.iLike]: `%${search}%` } };
  }

  if (page && limit) {
    options.offset = (page - 1) * parseInt(limit);
    options.limit = parseInt(limit) || 10;
  }

  try {
    const categories = await Category.findAll(options);
    const count = await Category.count(options);

    if (!count) {
      throw new NotFoundError("No categories were found");
    }

    res.status(StatusCodes.OK).json({
      categories,
      totalPages: Math.ceil(count / options.limit) || 1,
      currentPage: page || 1,
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    res.status(StatusCodes.OK).json({ category });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(StatusCodes.CREATED).json({ newCategory });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const {
    body: { name, description },
    params: { categoryId },
  } = req;

  if (!name && !description)
    throw new BadRequestError(
      "You must provide a value for any field to proceed with the update"
    );

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    await category.update(req.body);

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
