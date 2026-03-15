import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";

// ----------------------------
// Helpers
// ----------------------------
function normalizeStockMap(stock) {
  if (!stock) return {};

  if (typeof stock === "string") {
    try {
      stock = JSON.parse(stock);
    } catch {
      return {};
    }
  }

  if (typeof stock !== "object" || Array.isArray(stock)) return {};

  const out = {};
  for (const key in stock) {
    const val = Number(stock[key]);
    out[key] = isNaN(val) || val < 0 ? 0 : val;
  }
  return out;
}

function parseSizesInput(sizes) {
  if (!sizes) return [];

  if (typeof sizes === "string") {
    try {
      return JSON.parse(sizes);
    } catch {
      return [];
    }
  }

  return Array.isArray(sizes) ? sizes : [];
}

// ----------------------------
// ADD PRODUCT
// ----------------------------
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    if (!name?.trim() || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    if (!req.files || !req.files.image1 || !req.files.image1[0]) {
      return res.status(400).json({
        success: false,
        message: "At least 1 image is required",
      });
    }

    const parsedSizes = parseSizesInput(sizes);

    if (!parsedSizes.length) {
      return res.status(400).json({
        success: false,
        message: "At least one size is required",
      });
    }

    const normalizedStock = normalizeStockMap(stock);

    const finalStock = {};
    parsedSizes.forEach((s) => {
      finalStock[s] = normalizedStock[s] || 0;
    });

    // Upload images
    const image1 = await uploadOnCloudinary(req.files.image1[0].path);

    const image2 = req.files.image2?.[0]
      ? await uploadOnCloudinary(req.files.image2[0].path)
      : null;

    const image3 = req.files.image3?.[0]
      ? await uploadOnCloudinary(req.files.image3[0].path)
      : null;

    const image4 = req.files.image4?.[0]
      ? await uploadOnCloudinary(req.files.image4[0].path)
      : null;

    const product = await Product.create({
      name: name.trim(),
      description: description?.trim() || "",
      price: Number(price),
      stock: finalStock,
      category,
      subCategory,
      sizes: parsedSizes,
      bestSeller: bestSeller === "true" || bestSeller === true,
      image1,
      image2,
      image3,
      image4,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error FULL:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add product",
    });
  }
};

// ----------------------------
// LIST PRODUCTS
// ----------------------------
export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("List Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------------
// REMOVE PRODUCT
// ----------------------------
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
      product,
    });
  } catch (error) {
    console.error("Remove Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------------
// UPDATE STOCK (ADMIN)
// ----------------------------
export const updateProductStock = async (req, res) => {
  try {
    const { id, size, stock } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product id required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ---- single size update ----
    if (size) {
      const safeStock = Math.max(0, Number(stock) || 0);

      if (typeof product.stock === "number") {
        product.stock = { [size]: safeStock };
      } else if (product.stock && typeof product.stock.set === "function") {
        product.stock.set(size, safeStock);
      } else if (
        product.stock &&
        typeof product.stock === "object" &&
        !Array.isArray(product.stock)
      ) {
        product.stock = { ...(product.stock || {}), [size]: safeStock };
      } else {
        product.stock = { [size]: safeStock };
      }

      product.sizes = Array.isArray(product.sizes)
        ? Array.from(new Set([...(product.sizes || []), size]))
        : [size];

      product.markModified && product.markModified("stock");

      await product.save();

      return res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        product,
      });
    }

    // ---- bulk replace of stock ----
    if (stock !== undefined) {
      let normalized;

      if (typeof stock === "string") {
        try {
          normalized = JSON.parse(stock);
        } catch {
          const n = Number(stock);
          normalized = isNaN(n) ? stock : n;
        }
      } else {
        normalized = stock;
      }

      if (typeof normalized === "object" && !Array.isArray(normalized)) {
        product.stock = normalized;
        product.sizes = Object.keys(normalized);
        product.markModified && product.markModified("stock");
      } else {
        product.stock = normalized;
        if (typeof normalized === "number") product.sizes = [];
      }

      await product.save();

      return res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        product,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Nothing to update",
    });
  } catch (error) {
    console.error("Update Stock Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------------
// UPDATE PRODUCT PRICE (ADMIN)
// ----------------------------
export const updateProductPrice = async (req, res) => {
  try {
    const { id, price } = req.body;

    if (!id || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product id and price required",
      });
    }

    const safePrice = Number(price);

    if (isNaN(safePrice) || safePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { price: safePrice },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Price updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Price Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
