import http from "http";
import express, { Router } from "express";
import { Server as SocketIOServer } from "socket.io";
import cors, { CorsOptions } from "cors";
import { cartController, menuController } from "./controllers";

const app = express();
const httpServer = http.createServer(app);

const PORT = 5000;

// Setup socket-io
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

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
app.use("/menu", menuRoute);

// CART ROUTES
const cartRoute = Router();
cartRoute.get("/", cartController.getCartItems);
cartRoute.post("/add-item", cartController.addCartItem);
cartRoute.get("/remove-item", cartController.removeCartItem);
cartRoute.post("/clear", cartController.clearCartItems);
app.use("/cart", cartRoute);

io.on("connected", (socket) => {
  console.log("A user connected", console.timeStamp("fred"));

  socket.emit("cart-updated");

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

export default () => {
  httpServer.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
};
