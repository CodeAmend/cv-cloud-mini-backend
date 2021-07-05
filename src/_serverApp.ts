import http, { Server as HttpServer } from "http";
import express, { Router, Application as ExpressApplication } from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import { cartController, menuController } from "./controllers";
import { corsOptions, socketIOOptions } from "./config";

dotenv.config();
// Setup cors

class ServerApp {
  static _instance: ServerApp;
  static _httpServer: HttpServer;
  private appId: string;
  private app: ExpressApplication;
  private httpServer: HttpServer;
  private port: string | number;
  public socket: Promise<Socket>;

  constructor() {
    this.app = express();
    this.setupApp();
    this.setupRoutes();
    this.appId = Math.random().toString(36).substr(2, 14);
    this.httpServer = http.createServer(this.app);
    this.port = process.env.PORT || 5000;
    this.socket = this.SocketInstance;
  }

  private setupApp() {
    this.app.use;
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
  }

  private setupRoutes() {
    const menuRoute = Router();
    menuRoute.get("/", menuController.getMenuItems);
    menuRoute.post("/add-item", menuController.addMenuItem);
    this.app.use("/menu", menuRoute);

    const cartRoute = Router();
    cartRoute.get("/", cartController.getCartItems);
    cartRoute.post("/add-item", cartController.addCartItem);
    cartRoute.get("/remove-item", cartController.removeCartItem);
    cartRoute.post("/clear", cartController.clearCartItems);
    this.app.use("/cart", cartRoute);
  }

  public get AppId(): string {
    return this.appId;
  }

  public static get Instance(): ServerApp {
    if (!ServerApp._instance) {
      ServerApp._instance = new ServerApp();
    }
    return ServerApp._instance;
  }

  public get HttpServerInstance(): HttpServer {
    return this.httpServer;
  }

  private get SocketInstance(): Promise<Socket> {
    return new Promise((resolve) => {
      const io = new SocketIOServer(this.httpServer, socketIOOptions);
      io.on("connect", (socket) => {
        console.log("Connected");
        resolve(socket);

        socket.on("disconnect", () => {
          console.log("Disconnected");
        });
      });
    });
  }

  public startServer() {
    return this.httpServer.listen(this.port, () => {
      console.log(`Server started at port ${this.port}`);
    });
  }
}

export default ServerApp.Instance;
