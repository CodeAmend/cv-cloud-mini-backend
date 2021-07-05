import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000"],
  methods: ["GET", "POST", "DELETE", "UPDATE"],
  allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
};

export const socketIOOptions = {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE"],
  },
};

export const PORT = 5000;
