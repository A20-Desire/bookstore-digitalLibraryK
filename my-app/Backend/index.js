import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import translateRoute from "./route/translate.route.js";
import communityRoute from "./route/community.route.js";
import analyticsRoute from "./route/analytics.route.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGINS = process.env.FRONTEND_URL?.split(",") ?? ["http://localhost:5173", "http://localhost:5174"];

app.use(helmet());
app.use(cors({ origin: FRONTEND_ORIGINS, credentials: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

const mongoUri = process.env.MongoDBURI;
if (!mongoUri) {
  console.warn("MongoDBURI is not defined. Please set it in the environment variables.");
}

mongoose
  .connect(mongoUri, {
    autoIndex: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/community", communityRoute);
app.use("/analytics", analyticsRoute);
app.use("/api", translateRoute);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error", err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
