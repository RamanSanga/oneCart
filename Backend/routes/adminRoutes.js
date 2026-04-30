import express from "express";
import { 
  getAdminStats, 
  getAllReviews, 
  deleteReview, 
  getSettings, 
  updateSetting, 
  getStockAlerts,
  getPublicSettings,
  subscribeNewsletter,
  getAllLeads
} from "../controller/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.get("/settings/public", getPublicSettings);
router.post("/newsletter/subscribe", subscribeNewsletter);

// Protected admin routes
router.get("/stats", adminAuth, getAdminStats);
router.get("/leads", adminAuth, getAllLeads);

// Review Management
router.get("/reviews", adminAuth, getAllReviews);
router.delete("/review/delete/:id", adminAuth, deleteReview);

// Settings (Offer Banner etc)
router.get("/settings", adminAuth, getSettings);
router.post("/settings/update", adminAuth, updateSetting);

// Stock Alerts
router.get("/stock-alerts", adminAuth, getStockAlerts);

export default router;
