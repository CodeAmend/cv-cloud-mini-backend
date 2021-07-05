import http from "http";
import express, { Router } from "express";
// import { Server as SocketIOServer } from "socket.io";
import cors, { CorsOptions } from "cors";
import { cartController, menuController } from "./controllers";

const app = express();
const httpServer = http.createServer(app);

const PORT = 5000;

// Setup cors
const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
};

app.use(cors(corsOptions));
app.use(express.json());

// MENU ROUTES
const menuRoute = Router();
menuRoute.get("/", menuController.getMenuItems);
menuRoute.post("/add-item", menuController.addMenuItem);

// CART ROUTES
const cartRoute = Router();
cartRoute.get("/", cartController.getCartItems);
cartRoute.post("/add-item", cartController.addCartItem);
cartRoute.get("/remove-item", cartController.removeCartItem);
cartRoute.post("/clear", cartController.clearCartItems);

// Use Routes
app.use("/menu", menuRoute);
app.use("/cart", cartRoute);

export default () => {
  httpServer.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
};
