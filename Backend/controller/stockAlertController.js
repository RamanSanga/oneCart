import StockAlert from "../model/stockAlertModel.js";
import Product from "../model/productModel.js";

export const addStockAlert = async (req, res) => {
  try {
    const { productId, size, email } = req.body;

    if (!productId || !size || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Check if alert already exists for this email/size/product
    const existing = await StockAlert.findOne({ productId, size, email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Alert already set for this item" });
    }

    const newAlert = new StockAlert({
      productId,
      productName: product.name,
      size,
      email
    });

    await newAlert.save();
    res.status(201).json({ success: true, message: "Notification alert set!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
