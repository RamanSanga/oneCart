import React, { useContext } from "react";
import { Heart, ShoppingBag, X, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { shopDataContext } from "../Context/ShopContext";

function Wishlist() {
  const navigate = useNavigate();
  const { 
    currency, 
    addToCart, 
    wishlistItems, 
    wishlistLoading, 
    toggleWishlist 
  } = useContext(shopDataContext);

  /* ================= STOCK CALCULATION ================= */
  const getTotalStock = (product) => {
    if (typeof product.stock === "number") return product.stock;
    if (product.stock && typeof product.stock === "object") {
      const plain = product.stock.toObject ? product.stock.toObject() : { ...product.stock };
      return Object.values(plain).reduce((sum, val) => sum + (Number(val) || 0), 0);
    }
    return 0;
  };

  if (wishlistLoading) {
    return (
      <section className="pt-[120px] pb-32 bg-[#faf9f5] min-h-screen flex flex-col justify-center items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />
        <p className="text-gray-400 text-sm tracking-[0.2em] uppercase font-medium">Curating your favorites</p>
      </section>
    );
  }

  return (
    <section className="pt-[120px] pb-32 bg-[#faf9f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ================= HEADER ================= */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-[1px] w-12 bg-black" />
             <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Personal Collection</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-950">
            Your <span className="italic">Wishlist</span>
          </h1>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {wishlistItems.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)]">
            <div className="w-24 h-24 rounded-full bg-[#faf9f5] flex items-center justify-center mb-8 shadow-inner">
              <Heart size={32} className="text-gray-300" />
            </div>

            <h2 className="text-2xl font-light text-gray-950 mb-4 tracking-tight">
              Nothing saved yet
            </h2>

            <p className="text-gray-500 mb-10 max-w-sm px-6 leading-relaxed">
              Curate your perfect wardrobe. Browse our collection and save the items you love most.
            </p>

            <Link
              to="/collection"
              className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-sm font-medium uppercase tracking-[0.2em] transition hover:bg-gray-800 shadow-xl"
            >
              Explore Collection
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* ================= GRID ================= */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => {
              const totalStock = getTotalStock(item);
              const lowStock = totalStock > 0 && totalStock <= 3;
              const outOfStock = totalStock <= 0;

              return (
                <div key={item._id} className="group relative bg-white rounded-[32px] p-3 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-50">

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-6 right-6 z-30 bg-white/90 backdrop-blur-md rounded-full p-2.5 shadow-sm text-gray-400 hover:text-red-500 transition-all hover:scale-110 active:scale-95"
                    title="Remove from wishlist"
                  >
                    <X size={16} />
                  </button>

                  {/* IMAGE */}
                  <div
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                    className="cursor-pointer relative aspect-[3/4] overflow-hidden bg-[#f8f8f8] rounded-[24px]"
                  >
                    <img
                      src={item.image1}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {lowStock && (
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-orange-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                        Only {totalStock} left
                      </div>
                    )}

                    {outOfStock && (
                      <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
                          Out of stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="mt-6 px-2 space-y-2 text-center">
                    <h3 
                      onClick={() => navigate(`/productdetail/${item._id}`)}
                      className="text-[15px] font-light tracking-tight text-gray-950 cursor-pointer hover:text-black transition-colors truncate"
                    >
                      {item.name}
                    </h3>

                    <p className="text-lg font-semibold text-gray-950">
                      {currency} {item.price}
                    </p>
                  </div>

                  {/* ACTION BAR */}
                  <div className="mt-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      disabled={outOfStock}
                      onClick={() => {
                        const defaultSize = item.sizes?.[0];
                        if (!defaultSize) return;
                        addToCart(item._id, defaultSize);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      <ShoppingBag size={14} />
                      Add to Bag
                    </button>

                    <button
                      onClick={() => navigate(`/productdetail/${item._id}`)}
                      className="w-full py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black hover:bg-gray-50 transition"
                    >
                      View Details
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
