import User from "../model/userModel.js";
import Product from "../model/productModel.js";

/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;

    if (!itemId || !size) {
      return res.status(400).json({ message: "itemId and size required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(itemId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!product.sizes.includes(size)) {
      return res.status(400).json({ message: "Invalid size" });
    }

    const availableStock = product.stock.get(size) || 0;
    if (availableStock <= 0) {
      return res.status(400).json({ message: "Size out of stock" });
    }

    let cartData = user.cartData || {};
    if (!cartData[itemId]) cartData[itemId] = {};

    const currentQty = cartData[itemId][size] || 0;

    if (currentQty + 1 > availableStock) {
      return res.status(400).json({
        message: `Only ${availableStock} left for size ${size}`,
      });
    }

    cartData[itemId][size] = currentQty + 1;

    user.cartData = cartData;
    user.markModified("cartData");
    await user.save();

    return res.status(200).json({
      message: "Item added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.log("Add to cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= UPDATE CART ================= */
export const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(itemId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const availableStock = product.stock.get(size) || 0;

    let cartData = user.cartData || {};
    if (!cartData[itemId]) {
      return res.status(400).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      if (quantity > availableStock) {
        return res.status(400).json({
          message: `Only ${availableStock} available for size ${size}`,
        });
      }
      cartData[itemId][size] = quantity;
    }

    user.cartData = cartData;
    user.markModified("cartData");
    await user.save();

    return res.status(200).json({
      message: "Cart updated successfully",
      cartData: user.cartData,
    });
  } catch (error) {
    console.log("Update cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/* ================= GET USER CART ================= */
export const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      cartData: user.cartData || {}
    });

  } catch (error) {
    console.log("Get cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ...existing code...