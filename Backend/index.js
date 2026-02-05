import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rajorRouter from "./routes/rajorRouter.js";

const app = express();

// ======= BASIC MIDDLEWARE =======
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

// ======= CORRECT CORS (VERY IMPORTANT FOR RENDER) =======
const allowedOrigins = [
  "https://onecart-1-frontend32.onrender.com",
  "https://onecart-1-admin3.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman, mobile apps, or server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Handle preflight requests (CRUCIAL)
app.options("*", cors());

// ======= HEALTH CHECK =======
app.get("/health", (_req, res) => res.send("OK"));

// ======= ROUTES =======
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rajor", rajorRouter);

// ======= PORT & DB CONNECTION =======
const port = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

