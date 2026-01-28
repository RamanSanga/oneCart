import crypto from "crypto";
import User from "../model/userModel.js";
import * as OrderModule from "../model/orderModel.js";

const Order = OrderModule.default || OrderModule.Order || OrderModule;

// lazy-load Razorpay to avoid startup crash if package is not installed
async function getRazorpayInstance() {
  try {
    const mod = await import("razorpay");
    const Razorpay = mod.default || mod;
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    // throw a controlled error so callers can return a helpful message
    const e = new Error(
      "Razorpay SDK not available. Run `npm install razorpay` in Backend directory."
    );
    e.code = "RAZORPAY_MISSING";
    throw e;
  }
}

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", items = [], address = {} } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const razorpay = await getRazorpayInstance();

    const options = {
      amount: Math.round(Number(amount) * 100), // paise
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const rOrder = await razorpay.orders.create(options);

    const userId = req.userId || null;

    const orderData = {
      userId,
      items,
      amount: Number(amount),
      address,
      paymentMethod: "razorpay",
      paid: false,
      status: "Payment Pending",
      date: Date.now(),
      createdAt: Date.now(),
      razorpayOrderId: rOrder.id,
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    return res.status(200).json({
      razorpayOrder: rOrder,
      orderId: newOrder._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    if (error.code === "RAZORPAY_MISSING") {
      return res.status(500).json({ message: error.message });
    }
    console.error("rajorController.createRazorpayOrder error:", error);
    return res.status(500).json({ message: "Failed to create Razorpay order", error: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ message: "Missing verification parameters" });
    }

    // verify signature using secret (no SDK required)
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paid = true;
    order.status = "Processing";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpayOrderId = razorpay_order_id;
    await order.save();

    if (order.userId) {
      try {
        await User.findByIdAndUpdate(order.userId, { cartData: {} });
      } catch (e) {
        console.warn("Failed to clear user cart after payment:", e.message || e);
      }
    }

    return res.status(200).json({ message: "Payment verified", orderId: order._id });
  } catch (error) {
    console.error("rajorController.verifyRazorpayPayment error:", error);
    return res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

export default { createRazorpayOrder, verifyRazorpayPayment };