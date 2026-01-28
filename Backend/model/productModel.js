import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, trim: true },

    price: { type: Number, required: true, min: 0 },

    // ✅ STOCK PER SIZE (STRICT)
    stock: {
      type: Map,
      of: {
        type: Number,
        min: 0,
        default: 0,
      },
      default: {},
    },

    // ✅ Enabled sizes only
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      default: [],
    },

    category: { type: String, trim: true },
    subCategory: { type: String, trim: true },

    bestSeller: { type: Boolean, default: false },

    image1: { type: String, required: true },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
  },
  { timestamps: true }
);

// 🔥 Virtual total stock (optional, useful later)
productSchema.virtual("totalStock").get(function () {
  let total = 0;
  if (this.stock) {
    for (let v of this.stock.values()) {
      total += v || 0;
    }
  }
  return total;
});

const Product = mongoose.model("Product", productSchema);
export default Product;
