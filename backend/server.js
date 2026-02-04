import express from "express";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import carRouter from "./routes/carRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded images
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

// routes
app.use("/api/cars", carRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/auth", authRouter);
app.use("/api/payments", paymentRouter);

app.get("/api/ping", (req, res) => res.json({ ok: true, time: Date.now() }));

// ✅ Await DB connection before starting server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
};

startServer();
