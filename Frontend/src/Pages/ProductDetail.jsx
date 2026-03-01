import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { shopDataContext } from "../Context/ShopContext";
import { authDataContext } from "../Context/AuthContext";
import RelatedProduct from "../component/relatedProduct";
import { Heart } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    products,
    currency,
    addToCart,
    wishlistItems,
    getWishlist,      // ✅ backend refresh
  } = useContext(shopDataContext);

  const { serverUrl } = useContext(authDataContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCartToast, setShowCartToast] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!products || products.length === 0) return;

    const item = products.find((p) => p._id === id);
    if (!item) return;

    setProductData(item);
    setImage(item.image1 || "");
  }, [id, products]);

  /* ================= DEFAULT SIZE ================= */
  useEffect(() => {
    if (!productData) return;

    if (!size && productData.sizes?.length) {
      setSize(productData.sizes[0]);
    }
  }, [productData]);

  /* ================= SYNC WITH BACKEND WISHLIST ================= */
  useEffect(() => {
    if (!productData) return;

    const exists = wishlistItems.some(
      (item) => item._id === productData._id
    );

    setIsWishlisted(exists);
  }, [wishlistItems, productData]);

  /* ================= TOGGLE WISHLIST (BACKEND) ================= */
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
      console.log("Wishlist error:", error?.response?.data || error.message);
    }
  };

  /* ================= STOCK HELPER ================= */
  const getStockForSize = (selectedSize) => {
    if (!productData) return 0;

    if (typeof productData.stock === "number")
      return productData.stock;

    if (
      typeof productData.stock === "object" &&
      productData.stock !== null
    ) {
      return Number(productData.stock[selectedSize] || 0);
    }

    return 0;
  };

  if (!productData) {
    return (
      <div className="pt-40 text-center">
        Loading...
      </div>
    );
  }

  const remainingStock = getStockForSize(size);

  return (
    <section className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

        {/* ================= IMAGES ================= */}
        <div className="flex gap-4">
          <div className="flex flex-row md:flex-col gap-3">
            {[productData.image1,
              productData.image2,
              productData.image3,
              productData.image4].map(
              (img, index) =>
                img && (
                  <div
                    key={index}
                    onClick={() => setImage(img)}
                    className={`w-20 h-24 overflow-hidden cursor-pointer border ${
                      image === img
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
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

            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full"
            >
              <Heart
                size={18}
                className={
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700"
                }
              />
            </button>
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            {productData.category}
          </p>

          <h1 className="text-3xl font-light">
            {productData.name}
          </h1>

          <p className="text-xl font-medium">
            {currency} {productData.price}
          </p>

          <p className="text-gray-600 leading-relaxed">
            {productData.description ||
              "Premium quality designed for comfort."
            }
          </p>

          {productData.sizes?.length > 0 && (
            <div>
              <p className="text-sm uppercase tracking-widest mb-3 text-gray-500">
                Size
              </p>

              <div className="flex gap-3">
                {productData.sizes.map((s) => {
                  const stock = getStockForSize(s);

                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      disabled={stock <= 0}
                      className={`px-4 py-2 border ${
                        size === s
                          ? "border-black bg-black text-white"
                          : "border-gray-300"
                      } ${
                        stock <= 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              disabled={remainingStock <= 0}
              onClick={() => {
                if (!size) return;

                addToCart(productData._id, size);
                setShowCartToast(true);

                setTimeout(() => {
                  setShowCartToast(false);
                }, 2500);
              }}
              className="flex-1 py-4 border border-black uppercase tracking-widest hover:bg-black hover:text-white transition disabled:opacity-50"
            >
              Add to Cart
            </button>

            <button
              onClick={toggleWishlist}
              className="px-6 py-4 border border-gray-300 uppercase tracking-widest hover:border-black transition"
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

      {showCartToast && (
        <div className="fixed bottom-6 right-4 bg-white border shadow-lg p-4">
          <p className="text-sm font-medium">
            Added to cart
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="mt-2 text-xs underline"
          >
            View Cart
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;
