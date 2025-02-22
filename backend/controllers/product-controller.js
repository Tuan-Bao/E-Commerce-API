import { Op } from "sequelize";
import { NotFoundError, BadRequestError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product.js";

const getAllProducts = async (req, res, next) => {
  const {
    page,
    limit,
    search,
    categoryId,
    sortBy = "id",
    sortOrder = "ASC",
  } = req.query;

  const options = {
    order: [[sortBy, sortOrder.toUpperCase()]],
  };

  if (search) {
    options.where = { name: { [Op.iLike]: `%${search}%` } };
  }

  if (categoryId === "-1") {
    options.where.categoryId = { [Op.is]: null };
  } else if (categoryId) {
    options.where.categoryId = categoryId;
  }

  if (page && limit) {
    options.offset = (page - 1) * parseInt(limit);
    options.limit = parseInt(limit) || 10;
  }

  try {
    const products = await Product.findAll(options);
    const count = await Product.count(options);

    if (!count) {
      throw new NotFoundError("No products was found");
    }

    res.status(StatusCodes.OK).json({
      products,
      totalPages: Math.ceil(count / options.limit) || 1,
      currentPage: page || 1,
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    req.status(StatusCodes.CREATED).json({ newProduct });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const {
    body: { name, description, price, stock, categoryId },
    params: { productId: productId },
  } = req;

  if (!name && !description && !price && !stock && !categoryId) {
    throw new BadRequestError(
      "You must provide a value for any field to proceed with the update"
    );
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    await product.update(req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "product updated successfully ", product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    await product.destroy();
    res
      .status(StatusCodes.OK)
      .json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
