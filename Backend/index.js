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
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000" // add if you run frontend on 3000
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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