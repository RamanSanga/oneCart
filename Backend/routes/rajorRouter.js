import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controller/rajorController.js ";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// Create razorpay order and DB order (payment pending)
router.post("/create-order", isAuth, createRazorpayOrder);

// Verify payment signature and mark order paid
router.post("/verify", isAuth, verifyRazorpayPayment);

export default router;