import User from "../model/userModel.js";
import Product from "../model/productModel.js";

/* ================= ADD TO WISHLIST ================= */
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      message: "Added to wishlist",
      wishlist: user.wishlist
    });

  } catch (error) {
    console.log("Wishlist add error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/* ================= REMOVE FROM WISHLIST ================= */
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(id => id !== productId);
    await user.save();

    return res.status(200).json({
      message: "Removed from wishlist",
      wishlist: user.wishlist
    });

  } catch (error) {
    console.log("Wishlist remove error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/* ================= GET WISHLIST ================= */
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const products = await Product.find({
      _id: { $in: user.wishlist }
    });

    return res.status(200).json({ products });

  } catch (error) {
    console.log("Wishlist get error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
