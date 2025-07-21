import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// *Routes Middleware

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
