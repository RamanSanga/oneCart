import Coupon from "../model/couponModel.js";

// Add a new coupon (Admin)
export const addCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate, description } = req.body;
    
    const existing = await Coupon.findOne({ code });
    if (existing) return res.status(400).json({ success: false, message: "Coupon code already exists" });

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate,
      description
    });

    await newCoupon.save();
    res.status(201).json({ success: true, message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all coupons (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a coupon (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate a coupon (User)
export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) return res.status(404).json({ success: false, message: "Invalid or inactive coupon code" });

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    if (amount < coupon.minOrderAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` 
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (amount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({ 
      success: true, 
      discount, 
      code: coupon.code,
      description: coupon.description 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { addCoupon, getAllCoupons, deleteCoupon, validateCoupon };
