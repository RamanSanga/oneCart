import express from "express";
import { addCoupon, getAllCoupons, deleteCoupon, validateCoupon } from "../controller/couponController.js";
import { isAuth } from "../middleware/isAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const couponRouter = express.Router();

// Admin routes
couponRouter.post("/add", adminAuth, addCoupon);
couponRouter.get("/list", adminAuth, getAllCoupons);
couponRouter.delete("/delete/:id", adminAuth, deleteCoupon);

// Public routes
couponRouter.get("/public-list", getAllCoupons);

// User routes
couponRouter.post("/validate", isAuth, validateCoupon);

export default couponRouter;
