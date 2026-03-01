import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { shopDataContext } from "../Context/ShopContext";
import { authDataContext } from "../Context/AuthContext";
import RelatedProduct from "../component/relatedProduct";
import { Heart } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const { products, currency, addToCart, wishlistItems, getWishlist } =
    useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [showCartToast, setShowCartToast] = useState(false);
  const [productData, setProductData] = useState(null);

  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [size, setSize] = useState("");

  const [isWishlisted, setIsWishlisted] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!products || products.length === 0) return;

    const item = products.find((p) => p._id === id);
    if (!item) return;

    setProductData(item);

    setImage1(item.image1 || "");
    setImage2(item.image2 || "");
    setImage3(item.image3 || "");
    setImage4(item.image4 || "");
    setImage(item.image1 || "");
  }, [id, products]);

  /* ================= DEFAULT SIZE ================= */
  useEffect(() => {
    if (!productData) return;
    if (!size && productData.sizes?.length) {
      setSize(productData.sizes[0]);
    }
  }, [productData]);

  /* ================= SYNC WISHLIST STATE ================= */
  useEffect(() => {
    if (!productData) return;

    const exists = wishlistItems.some(
      (item) => item._id === productData._id
    );

    setIsWishlisted(exists);
  }, [wishlistItems, productData]);

  /* ================= TOGGLE WISHLIST ================= */
  const toggleWishlist = async () => {
    if (!productData) return;

    try {
      if (isWishlisted) {
        await axios.post(
          `${serverUrl}/api/wishlist/remove`,
          { productId: productData._id },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${serverUrl}/api/wishlist/add`,
          { productId: productData._id },
          { withCredentials: true }
        );
      }

      await getWishlist(); // 🔥 refresh global wishlist
    } catch (error) {
      console.log("Wishlist toggle error:", error?.response?.data || error.message);
    }
  };

  /* ================= STOCK HELPERS ================= */
  const normalizeStockObj = (stock) => {
    if (!stock) return null;
    if (typeof stock === "number") return null;

    if (typeof stock === "object") {
      const plain = stock.toObject ? stock.toObject() : { ...stock };
      const out = {};
      Object.keys(plain).forEach((k) => (out[k] = Number(plain[k]) || 0));
      return out;
    }
    return null;
  };

  if (!productData) {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  const getStockForSize = (s) => {
    const stockObj = normalizeStockObj(productData.stock);
    if (stockObj && s) return Number(stockObj[s] || 0);
    if (typeof productData.stock === "number") return productData.stock;
    return 0;
  };

  const remainingStock = getStockForSize(size);

  return (
    <section className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

        {/* ================= IMAGES ================= */}
        <div className="flex gap-4">
          <div className="flex flex-row md:flex-col gap-3">
            {[image1, image2, image3, image4].map(
              (img, index) =>
                img && (
                  <div
                    key={index}
                    onClick={() => setImage(img)}
                    className={`w-20 h-24 overflow-hidden cursor-pointer border ${
                      image === img ? "border-black" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                )
            )}
          </div>

          <div className="flex-1 h-[420px] md:h-[520px] overflow-hidden bg-gray-100 relative rounded-lg">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-full object-cover"
            />

            {/* ❤️ HEART */}
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full hover:scale-110 transition"
            >
              <Heart
                size={18}
                className={`${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            {productData.category}
          </p>

          <h1 className="text-3xl font-light">{productData.name}</h1>

          <p className="text-xl font-medium">
            {currency} {productData.price}
          </p>

          <p className="text-gray-600 leading-relaxed">
            {productData.description ||
              "Designed with premium materials for everyday comfort."}
          </p>

          {/* SIZE */}
          {productData.sizes?.length > 0 && (
            <div>
              <p className="text-sm uppercase tracking-widest mb-3 text-gray-500">
                Size
              </p>
              <div className="flex gap-3">
                {productData.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 border ${
                      size === s
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4 mt-6">
            <button
              className="flex-1 py-4 border border-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition"
              onClick={() => {
                if (!size) return;
                addToCart(productData._id, size);
                setShowCartToast(true);
                setTimeout(() => setShowCartToast(false), 3000);
              }}
            >
              Add to Cart
            </button>

            <button
              onClick={toggleWishlist}
              className="px-6 py-4 border border-gray-300 uppercase tracking-widest text-sm hover:border-black transition"
            >
              {isWishlisted ? "Wishlisted ♥" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      <RelatedProduct
        category={productData.category}
        currentId={productData._id}
      />

      {/* ================= CART TOAST ================= */}
      {showCartToast && (
        <div className="fixed bottom-6 right-4 z-50 w-[300px] bg-white border border-gray-200 shadow-lg p-5">
          <p className="text-sm font-medium mb-1">Added to your cart</p>
          <p className="text-xs text-gray-500 mb-3">
            {productData.name} · Size {size}
          </p>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;
