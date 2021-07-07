import { Request, Response } from "express";
import { Socket } from "socket.io";
import MenuItemModel from "../models/MenuItemModel";
import serverApp from "../server";

const getSocket = (): Socket => {
  const app = serverApp.AppInstance;
  return app.get("io");
};

const getMenuItems = async (_: Request, res: Response) => {
  try {
    const menuItems = await MenuItemModel.find();
    if (!menuItems.length) {
      return res.status(204).json(menuItems);
    }
    getSocket().emit("get-menu-items");
    return res.status(200).json(menuItems);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const addMenuItem = async (req: Request, res: Response) => {
  const { body } = req;

  if (!body || !body?.name || !body?.price) {
    return res.status(400).json({ message: "Must submit a name and price" });
  }

  try {
    await MenuItemModel.create(body);

    getSocket().emit("add-menu-item");
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const menuController = { getMenuItems, addMenuItem };
export default menuController;
