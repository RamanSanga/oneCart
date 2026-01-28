import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shopDataContext } from "../Context/shopContext";
import RelatedProduct from "../component/RelatedProduct";
import { Heart } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const { products, currency, addToCart } = useContext(shopDataContext);

  const [showCartToast, setShowCartToast] = useState(false);
  const [productData, setProductData] = useState(null);

  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [size, setSize] = useState("");

  // ================= WISHLIST =================
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!productData) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.includes(productData._id));
  }, [productData]);

  const toggleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (wishlist.includes(productData._id)) {
      wishlist = wishlist.filter((pid) => pid !== productData._id);
      setIsWishlisted(false);
    } else {
      wishlist.push(productData._id);
      setIsWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  /* ================= helpers ================= */
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

  // default size
  useEffect(() => {
    if (!productData) return;
    if (!size && productData.sizes?.length) {
      setSize(productData.sizes[0]);
    }
  }, [productData]);

  if (!productData) {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  /* ================ STOCK HELPERS ================ */
  const getStockForSize = (s) => {
    const stockObj = normalizeStockObj(productData.stock);
    if (stockObj && s) return Number(stockObj[s] || 0);

    if (typeof productData.stock === "number") return productData.stock;
    return 0;
  };

  const remainingStock = getStockForSize(size);

  const stockMessage =
    remainingStock <= 0
      ? "Out of stock"
      : remainingStock <= 3
      ? `Hurry — only ${remainingStock} left`
      : null;

  return (
    <section className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

        {/* ================= IMAGES ================= */}
        <div className="flex gap-4">
          {/* THUMBNAILS */}
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

          {/* MAIN IMAGE */}
          <div className="flex-1 h-[420px] md:h-[520px] overflow-hidden bg-gray-100 relative rounded-lg">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-full object-cover"
            />

            {/* Wishlist Heart */}
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

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light">
            {productData.name}
          </h1>

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

              <div className="flex flex-wrap gap-3">
                {productData.sizes.map((s) => {
                  const sStock = getStockForSize(s);
                  const out = sStock <= 0;

                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      disabled={out}
                      className={`px-4 py-2 border text-sm ${
                        size === s
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      } ${out ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {s}
                      {sStock > 0 && sStock <= 3 && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded">
                          Only {sStock}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STOCK MESSAGE */}
          {stockMessage && (
            <div
              className={`text-sm ${
                remainingStock <= 0
                  ? "text-red-600"
                  : "text-yellow-700"
              }`}
            >
              {stockMessage}
            </div>
          )}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4 mt-6">
            {/* ADD TO CART */}
            <button
              className={`flex-1 py-4 border border-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition ${
                remainingStock <= 0
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
              disabled={remainingStock <= 0}
              onClick={() => {
                if (!size) return;
                if (remainingStock <= 0) return;

                addToCart(productData._id, size);
                setShowCartToast(true);
                setTimeout(() => setShowCartToast(false), 3000);
              }}
            >
              Add to Cart
            </button>

            {/* WISHLIST */}
            <button
              onClick={toggleWishlist}
              className="px-6 py-4 border border-gray-300 uppercase tracking-widest text-sm hover:border-black transition"
            >
              {isWishlisted ? "Wishlisted ♥" : "Add to Wishlist"}
            </button>
          </div>

          {/* EXTRA INFO */}
          <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 space-y-2">
            <p>• Free shipping on orders above ₹999</p>
            <p>• 7-day easy returns</p>
            <p>• Secure checkout</p>
          </div>
        </div>
      </div>

      <RelatedProduct
        category={productData.category}
        currentId={productData._id}
      />

      {/* ================= TOAST ================= */}
      {showCartToast && (
        <div className="fixed bottom-6 right-4 z-50 w-[300px] bg-white border border-gray-200 shadow-lg p-5">
          <p className="text-sm font-medium mb-1">Added to your cart</p>
          <p className="text-xs text-gray-500 mb-3">
            {productData.name} · Size {size}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/cart")}
              className="flex-1 py-2 text-sm border border-black hover:bg-black hover:text-white transition"
            >
              View Cart
            </button>
            <button
              onClick={() => setShowCartToast(false)}
              className="flex-1 py-2 text-sm border border-gray-300 hover:border-black transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;
