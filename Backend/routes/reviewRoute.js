import express from "express";
import { addReview, getProductReviews } from "../controller/reviewController.js";
import { isAuth } from "../middleware/isAuth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", isAuth, addReview);
reviewRouter.get("/product/:productId", getProductReviews);

export default reviewRouter;
