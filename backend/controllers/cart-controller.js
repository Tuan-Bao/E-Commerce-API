import { NotFoundError, BadRequestError } from "../errors/index.js";
import { Cart, CartItem } from "../models/cart.js";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product.js";

const createCart = async (req, res, next) => {
  const {
    user: { userId },
  } = req;
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      throw new BadRequestError("This user already has an associated cart.");
    }

    const newCart = await Cart.create({ userId });
    res.status(StatusCodes.CREATED).json({ newCart });
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  const {
    user: { userId },
  } = req;
  try {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw new NotFoundError("No associated Cart was found");
    }
    const cartId = cart.id;
    const count = await CartItem.count({ where: { cartId } });

    if (!count) {
      throw new NotFoundError("No items were found for this cart");
    }

    const cartItems = await CartItem.findAll({ where: { cartId } });

    let totalPrice = 0;
    const detailedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        const itemTotalPrice = item.quantity * product.price;
        totalPrice += itemTotalPrice;
        return {
          ...item.toJSON(),
          product,
          totalPrice: itemTotalPrice,
        };
      })
    );

    res
      .status(StatusCodes.OK)
      .json({ cart, totalPrice, cartItems: detailedCartItems });
  } catch (error) {
    next(error);
  }
};

const deleteCart = async (req, res, next) => {
  const {
    user: { userId },
  } = req;
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new NotFoundError("No cart was found");
    }

    const cartId = cart.id;
    await Cart.destroy({ where: { id: cartId } });
    await CartItem.destroy({ where: { cartId } });

    res
      .status(StatusCodes.OK)
      .json({ message: "Cart item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { createCart, getCart, deleteCart };
