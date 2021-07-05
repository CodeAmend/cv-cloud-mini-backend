import http from "http";
import express, { Router, Application as ExpressApplication } from "express";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { cartController, menuController } from "./controllers";
import { corsOptions, socketIOOptions } from "./config";

dotenv.config();
const PORT = process.env.PORT;

class ServerApp {
  public static instance: ServerApp;
  private app: ExpressApplication;

  constructor() {
    this.app = express();
    const httpServer = http.createServer(this.app);

    this.app.use(cors(corsOptions));
    this.app.use(express.json());

    const menuRoute = Router();
    menuRoute.get("/", menuController.getMenuItems);
    menuRoute.post("/add-item", menuController.addMenuItem);
    this.app.use("/menu", menuRoute);

    const cartRoute = Router();
    cartRoute.get("/", cartController.getCartItems);
    cartRoute.post("/add-item", cartController.addCartItem);
    cartRoute.delete("/remove-item", cartController.removeCartItem);
    cartRoute.delete("/clear", cartController.clearCartItems);
    this.app.use("/cart", cartRoute);

    const io = new SocketIOServer(httpServer, socketIOOptions);
    io.on("connect", (socket) => {
      console.log("Connected");
      this.app.set("io", socket);

      socket.on("front-end-message", (data) => {
        console.log(data);
      });

      socket.emit("server-restart");

      socket.on("disconnect", () => {
        console.log("Disconnected");
      });
    });

    httpServer.listen(PORT, () => {
      console.log(`Server started at PORT ${PORT}`);
    });
  }

  public get AppInstance() {
    return this.app;
  }

  public static get Instance() {
    if (!ServerApp.instance) {
      ServerApp.instance = new ServerApp();
    }

    return ServerApp.instance;
  }
}

export default ServerApp.Instance;
