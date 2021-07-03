import { Router } from "express";
import MenuController from "../controllers/MenuController";

class MenuItemRoute {
  private router: Router;

  constructor() {
    this.router = Router();
    this.setupRouter();
  }

  private setupRouter() {
    this.router.get("/", async (req, res) => {
      await MenuController.getMenuItems(req, res);
    });
    this.router.post("/add-item", async (req, res) => {
      await MenuController.addMenuItem(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new MenuItemRoute();
