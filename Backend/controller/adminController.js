import Product from "../model/productModel.js";
import Order from "../model/orderModel.js";

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
