import mongoose from "mongoose";

const stockAlertSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'notified'],
    default: 'pending'
  }
}, { timestamps: true });

const StockAlert = mongoose.model("StockAlert", stockAlertSchema);
export default StockAlert;
