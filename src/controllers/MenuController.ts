import { Request, Response } from "express";
import MenuItemModel from "../models/MenuItemModel";

const getMenuItems = async (_: Request, res: Response) => {
  try {
    const menuItems = await MenuItemModel.find();
    if (!menuItems.length) {
      return res.status(204).json(menuItems);
    }
    return res.status(200).json(menuItems);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const addMenuItem = async (req: Request, res: Response) => {
  const { body } = req;
  if (!body || !body?.name || !body?.price) {
    return res.status(400).json({ message: "Must submit a name and price" });
  }

  try {
    await MenuItemModel.create(body);
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const menuController = { getMenuItems, addMenuItem };
export default menuController;
