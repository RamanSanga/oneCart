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
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();
const port = process.env.PORT || 8000;

app.set("trust proxy", 1);



// ======= CORS (SAFE FOR USER + ADMIN FRONTENDS) =======
const allowedOrigins = [
  "https://onecart-1-frontend32.onrender.com",
  "https://onecart-1-admin3.onrender.com",
  "https://onecart-admin-d1du.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());
// health check
app.get("/health", (_req, res) => res.send("OK"));

// routes (UNCHANGED)
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rajor", rajorRouter);
app.use("/api/wishlist", wishlistRoutes);

// start server
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
