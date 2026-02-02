// ...existing code...
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import rajorRouter from "./routes/rajorRouter.js"; 

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://onecart-1-frontend32.onrender.com",
  "https://onecart-1-admin3.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// health route
app.get('/health', (_req, res) => res.send('OK'));

// register routes
app.use("/api/auth" , authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product" , productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rajor", rajorRouter);

// connect DB first, then listen
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
// ...existing code...
