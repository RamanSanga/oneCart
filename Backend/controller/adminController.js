import Product from "../model/productModel.js";
import Order from "../model/orderModel.js";
import Review from "../model/reviewModel.js";
import Setting from "../model/settingModel.js";
import StockAlert from "../model/stockAlertModel.js";
import Lead from "../models/leadModel.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return res.status(200).json({
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return res.status(500).json({ message: "Failed to load stats" });
  }
};
// REVIEW MANAGEMENT
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SETTINGS & BANNER
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// STOCK ALERTS
export const getStockAlerts = async (req, res) => {
  try {
    const alerts = await StockAlert.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUBLIC SETTINGS (No Auth)
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.find({ key: { $in: ["offer_banner"] } });
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEWSLETTER
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const existing = await Lead.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Already subscribed!" });

    await Lead.create({ email });
    res.status(200).json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
