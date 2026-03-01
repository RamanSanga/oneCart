import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { shopDataContext } from "../Context/ShopContext";
import { authDataContext } from "../Context/AuthContext";

function Wishlist() {
  const navigate = useNavigate();
  const { currency, addToCart } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD WISHLIST FROM BACKEND ================= */
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/wishlist/get`,
          { withCredentials: true }
        );

        setWishlistProducts(res.data.products || []);
      } catch (error) {
        console.log("Wishlist fetch error:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [serverUrl]);

  /* ================= REMOVE FROM WISHLIST ================= */
 const removeFromWishlist = async (productId) => {
  try {
    await axios.post(
      `${serverUrl}/api/wishlist/remove`,
      { productId },
      { withCredentials: true }
    );

    setWishlistProducts(prev =>
      prev.filter(item => item._id !== productId)
    );

  } catch (error) {
    console.log("Remove wishlist error:", error);
  }
};
  
  /* ================= STOCK CALCULATION ================= */
  const getTotalStock = (product) => {
    if (typeof product.stock === "number") return product.stock;

    if (product.stock && typeof product.stock === "object") {
      const plain = product.stock.toObject
        ? product.stock.toObject()
        : { ...product.stock };

      return Object.values(plain).reduce(
        (sum, val) => sum + (Number(val) || 0),
        0
      );
    }

    return 0;
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <section className="pt-[120px] pb-32 bg-[#fafafa] min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-sm tracking-wide">
          Loading your wishlist...
        </p>
      </section>
    );
  }

  return (
    <section className="pt-[120px] pb-32 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-14">
          <h1 className="text-3xl sm:text-4xl font-light tracking-wide mb-3">
            Wishlist
          </h1>
          <p className="text-sm text-gray-500 tracking-wide">
            Your saved premium picks
          </p>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {wishlistProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-32">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Heart size={32} className="text-gray-400" />
            </div>

            <h2 className="text-xl font-light mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-sm text-gray-500 mb-8 max-w-md">
              Save your favorite styles to your wishlist and come back anytime.
            </p>

            <button
              onClick={() => navigate("/collection")}
              className="px-8 py-3 border border-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* ================= GRID ================= */}
        {wishlistProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {wishlistProducts.map((item) => {
              const totalStock = getTotalStock(item);
              const lowStock =
                totalStock > 0 && totalStock <= 3;

              return (
                <div key={item._id} className="group relative">

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                    title="Remove from wishlist"
                  >
                    <X size={14} />
                  </button>

                  {/* LOW STOCK BADGE */}
                  {lowStock && (
                    <div className="absolute top-4 left-4 z-10 bg-yellow-100 text-yellow-900 px-2 py-1 text-xs rounded">
                      Hurry — {totalStock} left
                    </div>
                  )}

                  {/* OUT OF STOCK OVERLAY */}
                  {totalStock <= 0 && (
                    <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center text-red-600 text-sm font-medium">
                      Out of stock
                    </div>
                  )}

                  {/* IMAGE */}
                  <div
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                    className="cursor-pointer overflow-hidden bg-gray-100 rounded-lg"
                  >
                    <img
                      src={item.image1}
                      alt={item.name}
                      className="w-full h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* INFO */}
                  <div className="mt-4 space-y-1">
                    <p
                      onClick={() => navigate(`/productdetail/${item._id}`)}
                      className="text-sm font-light tracking-wide text-gray-800 cursor-pointer hover:underline"
                    >
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-900">
                      {currency} {item.price}
                    </p>
                  </div>

                  {/* ACTION BAR */}
                  <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition">
                    <button
                      disabled={totalStock <= 0}
                      onClick={() => {
                        const defaultSize = item.sizes?.[0];
                        if (!defaultSize) return;
                        addToCart(item._id, defaultSize);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 border border-black py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition disabled:opacity-50"
                    >
                      <ShoppingBag size={14} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/productdetail/${item._id}`)
                      }
                      className="px-4 py-2 border border-gray-300 text-xs uppercase tracking-widest hover:border-black transition"
                    >
                      View
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Wishlist;
