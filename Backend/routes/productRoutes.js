import express from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
  updateProductStock,
   updateProductPrice,
} from "../controller/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRoutes = express.Router();

/* ADD PRODUCT */
productRoutes.post(
  "/addproduct",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

/* LIST PRODUCTS */
productRoutes.get("/list", listProduct);

/* REMOVE PRODUCT */
productRoutes.post("/remove/:id", adminAuth, removeProduct);

/* ✅ UPDATE STOCK (THIS WAS MISSING) */
productRoutes.put("/update-stock", adminAuth, updateProductStock);
productRoutes.put("/update-price", updateProductPrice);

export default productRoutes;
