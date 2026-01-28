import User from "../model/userModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const sanitizedItems = items.map((it) => ({
      productId: it._id || it.productId,
      name: it.name,
      price: Number(it.price),
      image1: it.image1,
      size: it.size,
      quantity: Number(it.quantity),
    }));

    // ================= STOCK VALIDATION (PER SIZE) =================
    for (const item of sanitizedItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      if (!product.sizes.includes(item.size)) {
        return res.status(400).json({
          message: `Invalid size for ${product.name}`,
        });
      }

      // normalize stock (Map or Object)
      const stockObj =
        typeof product.stock?.get === "function"
          ? Object.fromEntries(product.stock)
          : { ...(product.stock || {}) };

      const available = Number(stockObj[item.size] || 0);

      if (available < item.quantity) {
        return res.status(400).json({
          message: `${product.name} (${item.size}) only has ${available} left`,
        });
      }
    }

    // ================= CREATE ORDER =================
    const newOrder = new Order({
      userId: user._id,
      items: sanitizedItems,
      amount,
      address,
      paymentMethod: paymentMethod || "cod",
      paid: false,
      status: "Processing",
      date: Date.now(),
      createdAt: Date.now(),
    });

    await newOrder.save();

    // ================= REDUCE STOCK (PER SIZE) =================
    for (const item of sanitizedItems) {
      const product = await Product.findById(item.productId);

      const stockObj =
        typeof product.stock?.get === "function"
          ? Object.fromEntries(product.stock)
          : { ...(product.stock || {}) };

      const current = Number(stockObj[item.size] || 0);
      stockObj[item.size] = Math.max(0, current - item.quantity);

      product.stock = stockObj;
      product.markModified("stock");
      await product.save();
    }

    // ================= CLEAR CART =================
    user.cartData = {};
    user.markModified("cartData");
    await user.save();

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("PlaceOrder Error:", error);
    return res.status(500).json({
      message: "Place order failed",
      error: error.message,
    });
  }
};


/**
 * GET /api/order/user
 * returns { orders: [...] }
 */
export const getUserOrder = async (req, res) => {
  try {
    let userId = req.userId;
    if (!userId && req.userEmail) {
      const u = await User.findOne({ email: req.userEmail }).select("_id");
      userId = u ? String(u._id) : null;
    }
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });

    const orders = await Order.find({ userId }).sort({ date: -1 }).lean();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("GetUserOrders Error:", error);
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

/**
 * Optional helper route: fetch single order by id (used by /useorder)
 */
export const useOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "orderId required" });

    const order = await Order.findById(orderId).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ order });
  } catch (error) {
    console.error("useOrder Error:", error);
    return res.status(500).json({ message: "Failed", error: error.message });
  }
};

export default { placeOrder, getUserOrder, useOrder };


// for admin: get all orders
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("GetAllOrders Error:", error);
    return res.status(500).json({ message: "Failed to fetch all orders", error: error.message });
  }
}


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "orderId and status are required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("UpdateOrderStatus Error:", error);
    return res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
