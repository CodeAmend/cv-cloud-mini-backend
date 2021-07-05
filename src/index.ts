import dotenv from "dotenv";
import mongoose from "mongoose";

import startExpressServer from "./index";

dotenv.config();

(async () => {
  console.log("Starting...");
  await mongoose.connect(process.env.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  startExpressServer();
})();
