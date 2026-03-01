import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controller/wishlistController.js";

const wishlistRoutes = express.Router();

wishlistRoutes.post("/add", isAuth, addToWishlist);
wishlistRoutes.post("/remove", isAuth, removeFromWishlist);
wishlistRoutes.get("/get", isAuth, getWishlist);

export default wishlistRoutes;
