import express from 'express'
import rateLimit from "express-rate-limit";
import { adminLogin, googleLogin, login, logout, registration } from '../controller/authController.js';

const authRoutes = express.Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login/registration attempts from this IP. Please try again after 15 minutes."
  }
});

authRoutes.post("/registration", authRateLimiter, registration)
authRoutes.post("/login", authRateLimiter, login);
authRoutes.get("/logout", logout);
authRoutes.post("/googlelogin", authRateLimiter, googleLogin)
authRoutes.post("/adminlogin", authRateLimiter, adminLogin)

export default authRoutes