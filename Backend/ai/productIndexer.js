import Product from "../model/productModel.js";
import { embedText } from "./embedding.js";
import { getProductCollection } from "./vectorStore.js";

function normalizeStockValue(stock) {
  if (!stock) {
    return "";
  }

  if (stock instanceof Map) {
    return Array.from(stock.entries())
      .map(([size, value]) => `${size}:${value}`)
      .join(", ");
  }

  if (typeof stock === "object") {
    return Object.entries(stock)
      .map(([size, value]) => `${size}:${value}`)
      .join(", ");
  }

  return String(stock);
}

export function buildProductDocument(product) {
  return [
    product._id ? `Id: ${product._id.toString?.() || String(product._id)}` : null,
    `Name: ${product.name || ""}`,
    product.description ? `Description: ${product.description}` : null,
    product.category ? `Category: ${product.category}` : null,
    product.subCategory ? `Subcategory: ${product.subCategory}` : null,
    product.brand ? `Brand: ${product.brand}` : null,
    product.price !== undefined && product.price !== null ? `Price: ${product.price}` : null,
    Array.isArray(product.sizes) && product.sizes.length ? `Sizes: ${product.sizes.join(", ")}` : null,
    product.bestSeller ? "Best seller: yes" : null,
    product.stock ? `Stock: ${normalizeStockValue(product.stock)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildProductMetadata(product) {
  const rawStock = product.stock instanceof Map ? Object.fromEntries(product.stock.entries()) : product.stock || {};
  const image = product.image1 || product.image || product.images?.[0] || "";
  
  // Extract all non-empty image URLs
  const imageUrlsList = [
    product.image1,
    product.image2,
    product.image3,
    product.image4
  ].filter(Boolean);

  return {
    id: product._id?.toString?.() || String(product._id || ""),
    name: product.name || "",
    description: product.description || "",
    category: product.category || "",
    subCategory: product.subCategory || "",
    price: product.price ?? null,
    brand: product.brand || "",
    image, // Primary image
    image1: product.image1 || "",
    image2: product.image2 || "",
    image3: product.image3 || "",
    image4: product.image4 || "",
    imageUrls: imageUrlsList.join(", "), // Comma-separated list of image URLs
    sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "", // Comma-separated string is safer for all ChromaDB versions
    sizesJson: JSON.stringify(product.sizes || []), // Stringified JSON array fallback
    bestSeller: Boolean(product.bestSeller),
    stockSummary: normalizeStockValue(product.stock),
    stockJson: JSON.stringify(rawStock),
  };
}

export async function indexProduct(product) {
  if (!product) {
    throw new Error("A product is required to index it.");
  }

  const collection = await getProductCollection();
  const document = buildProductDocument(product);
  const embedding = await embedText(document);
  const id = product._id?.toString?.() || String(product._id || "");

  await collection.upsert({
    ids: [id],
    embeddings: [embedding],
    documents: [document],
    metadatas: [buildProductMetadata(product)],
  });

  return { id };
}

export async function indexAllProducts(options = {}) {
  const products = await Product.find({}).lean();
  const limit = options.limit && options.limit > 0 ? options.limit : products.length;
  const selectedProducts = products.slice(0, limit);
  const results = [];

  for (const product of selectedProducts) {
    results.push(await indexProduct(product));
  }

  return {
    indexed: results.length,
    results,
  };
}

export async function removeProductFromIndex(productId) {
  if (!productId) {
    throw new Error("productId is required to remove an indexed product.");
  }

  const collection = await getProductCollection();
  await collection.delete({ ids: [String(productId)] });

  return {
    id: String(productId),
  };
}
