import Review from "../model/reviewModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";

// Add a review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.userId;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }

    const newReview = new Review({
      productId,
      userId,
      userName: user.name,
      rating,
      comment
    });

    await newReview.save();

    res.status(201).json({ success: true, message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ date: -1 });
    
    // Calculate stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
      : 0;

    res.status(200).json({ 
      success: true, 
      reviews, 
      stats: {
        totalReviews,
        averageRating
      }
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { addReview, getProductReviews };
