import express from "express";
import { getAdminStats } from "../controller/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Protected admin route
router.get("/stats", adminAuth, getAdminStats);

export default router;
