import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import menuRoute from "./routers/MenuRoute";

const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

class ApiApp {
  private application: Application;

  constructor() {
    this.application = express();
    this.setupGlobalMiddleware();
    this.setupRouters();
  }

  start(port: string | number = 3000) {
    return this.application.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`listening on port ${port}`);
    });
  }

  getApplication() {
    return this.application;
  }

  private setupGlobalMiddleware() {
    this.application.use(express.json());
    this.application.use(cors(corsOptions));
  }

  private setupRouters() {
    this.application.get("/", (_, res) => {
      res.json({ message: "Welcome to the app!" });
    });
    this.application.use("/menu", menuRoute.getRouter());
  }
}

export default new ApiApp();
