import { Request, Response } from "express";
import CartModel from "../models/CartModel";
import MenuItemModel from "../models/MenuItemModel";

const getCartItems = async (_: Request, res: Response) => {
  try {
    const cartItems = await CartModel.find();
    if (!cartItems.length) {
      return res.status(204).json({ message: "No cart items" });
    }
    return res.status(200).json(cartItems);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const addCartItem = async (req: Request, res: Response) => {
  const { body } = req;
  if (!body || !body.name) {
    return res.status(400).json({ message: "Must submit a name" });
  }

  try {
    const menuItem = await MenuItemModel.findOne({ name: body.name });
    if (!menuItem) {
      return res.status(400).json({ message: "No items found!" });
    }

    await CartModel.findOneAndUpdate(
      { name: body.name },
      { $inc: { quantity: 1 } },
      { new: true, upsert: true }
    ).exec();

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const removeCartItem = async (req: Request, res: Response) => {
  const { body } = req;
  if (!body || !body.name) {
    return res.status(400).json({ message: "Must submit a name" });
  }
  try {
    const cartItem = await CartModel.findOne({ name: body.name });

    if (!cartItem) {
      return res.status(400).json({ message: "No items found" });
    }

    if (cartItem.quantity <= 1) {
      await CartModel.findOneAndDelete({ name: body.name }).exec();
      return res.status(204).end();
    } else {
      await CartModel.findOneAndUpdate(
        { name: body.name },
        { $inc: { quantity: -1 } }
      ).exec();
      return res.status(204).end();
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const clearCartItems = async (_: Request, res: Response) => {
  try {
    await CartModel.remove({});
    return res.status(204).json({ message: "Success!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const cartController = {
  getCartItems,
  addCartItem,
  removeCartItem,
  clearCartItems,
};
export default cartController;
