import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";

// ----------------------------
// Helpers
// ----------------------------
function normalizeStockMap(stock) {
  if (!stock) return {};

  // If string → JSON
  if (typeof stock === "string") {
    try {
      stock = JSON.parse(stock);
    } catch {
      return {};
    }
  }

  // Must be object map
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

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    if (!req.files || !req.files.image1) {
      return res.status(400).json({ message: "At least 1 image is required" });
    }

    // Upload images
    const image1 = await uploadOnCloudinary(req.files.image1[0].path);
    const image2 = req.files.image2
      ? await uploadOnCloudinary(req.files.image2[0].path)
      : null;
    const image3 = req.files.image3
      ? await uploadOnCloudinary(req.files.image3[0].path)
      : null;
    const image4 = req.files.image4
      ? await uploadOnCloudinary(req.files.image4[0].path)
      : null;

    const parsedSizes = parseSizesInput(sizes);
    const normalizedStock = normalizeStockMap(stock);

    // 🔒 SECURITY: Only keep stock for selected sizes
    const finalStock = {};
    parsedSizes.forEach((s) => {
      finalStock[s] = normalizedStock[s] || 0;
    });

    const product = await Product.create({
      name,
      description,
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

    return res.status(201).json(product);
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// LIST PRODUCTS
// ----------------------------
export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error("List Product Error:", error);
    return res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Remove Product Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// UPDATE STOCK (ADMIN)
// ----------------------------
// ...existing code...
// ...existing code...
// ...existing code...
export const updateProductStock = async (req, res) => {
  try {
    const { id, size, stock } = req.body;
    if (!id) return res.status(400).json({ message: "Product id required" });

    // Load full document so we never run dot-updates against a numeric 'stock'
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ---- single size update ----
    if (size) {
      const safeStock = Math.max(0, Number(stock) || 0);

      // If legacy numeric stock exists, convert to object and set the new size
      if (typeof product.stock === "number") {
        product.stock = { [size]: safeStock };
      } else if (product.stock && typeof product.stock.set === "function") {
        // Mongoose Map
        product.stock.set(size, safeStock);
      } else if (product.stock && typeof product.stock === "object" && !Array.isArray(product.stock)) {
        // plain object
        product.stock = { ...(product.stock || {}), [size]: safeStock };
      } else {
        product.stock = { [size]: safeStock };
      }

      // Ensure sizes array contains the size
      product.sizes = Array.isArray(product.sizes)
        ? Array.from(new Set([...(product.sizes || []), size]))
        : [size];

      // Make sure Mongoose notices changes to plain object
      product.markModified && product.markModified("stock");

      await product.save();
      return res.status(200).json(product);
    }

    // ---- bulk replace of stock (object JSON or numeric) ----
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
        // numeric or other fallback
        product.stock = normalized;
        if (typeof normalized === "number") product.sizes = [];
      }

      await product.save();
      return res.status(200).json(product);
    }

    return res.status(400).json({ message: "Nothing to update" });
  } catch (error) {
    console.error("Update Stock Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
// ...existing code...


// ----------------------------
// UPDATE PRODUCT PRICE (ADMIN)
// ----------------------------
export const updateProductPrice = async (req, res) => {
  try {
    const { id, price } = req.body;

    if (!id || price === undefined) {
      return res.status(400).json({ message: "Product id and price required" });
    }

    const safePrice = Number(price);
    if (isNaN(safePrice) || safePrice <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { price: safePrice },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Update Price Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
