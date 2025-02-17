import { Op } from "sequelize";
import { NotFoudError, BadRequestError } from "../errors";
import { Cart, CartItem } from "../models/cart";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product";

const getCartItem = async (req, res, next) => {
  const userId = req.user.userId;
  const itemId = req.params.itemId;
  try {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw new NotFoudError("No cart was found");
    }

    const cartId = cart.id;
    const cartItem = await CartItem.findOne({
      where: { productId: itemId, cartId },
    });

    if (!cartItem) {
      throw new NotFoudError("No cartitem was found");
    }

    res.status(StatusCodes.OK).json({ cartItem });
  } catch (error) {
    next(error);
  }
};

const createCartItem = async (req, res, next) => {
  const {
    user: { userId },
    body: { productId },
  } = req;
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new NotFoudError("No associated Cart was found");
    }

    const cartId = cart.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new NotFoudError("NO product was found with this id");
    }

    const existProduct = await CartItem.findOne({ where: { productId } });
    if (existProduct) {
      throw new BadRequestError(
        "A cart item is already linked to this product. You can use the update option to change the quantity instead"
      );
    }

    const newItem = await CartItem.create({ cartId, ...req.body });
    res.status(StatusCodes.CREATED).json({ newItem });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  const {
    body: { quantity },
    user: { userId },
    params: { itemId },
  } = req;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new NotFoudError("No associated Cart was found");
    }

    const cartId = cart.id;
    const item = await CartItem.findOne({
      where: { productId: itemId, cartId },
    });

    if (!item) {
      throw new NotFoudError("Cart item not found");
    }

    if (!quantity) {
      throw new BadRequestError("Quantity is required to make an update");
    }

    await item.update({ quantity });
    res
      .status(StatusCodes.OK)
      .json({ message: "Cart item updated successfully", item });
  } catch (error) {
    next(error);
  }
};

const deleteCartItem = async (req, res, next) => {
  const {
    user: { userId },
    params: { itemId },
  } = req;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new NotFoudError("No Cart was found");
    }

    const cartId = cart.id;
    const item = await CartItem.findOne({
      where: { productId: itemId, cartId },
    });

    if (!item) {
      throw new NotFoudError("Cart item not found");
    }

    await item.destroy();
    res
      .status(StatusCodes.OK)
      .json({ message: "Cart item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const clearCartItem = async (req, res, next) => {
  const {
    user: { userId },
  } = req;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new NotFoudError("Cart not found");
    }

    const cartId = cart.id;
    await CartItem.destroy({ where: { cartId } });
    res
      .status(StatusCodes.OK)
      .json({ message: "Cart was cleared successfully" });
  } catch (error) {
    next(error);
  }
};

exports = {
  getCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  clearCartItem,
};
