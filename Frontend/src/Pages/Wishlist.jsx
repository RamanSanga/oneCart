import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { shopDataContext } from "../Context/ShopContext";
import { FiHeart, FiShoppingBag, FiX, FiArrowRight } from "react-icons/fi";
import OurPolicy from "../component/OurPolicy";

export default function Wishlist() {
  const navigate = useNavigate();
  const { currency, addToCart, wishlistItems, wishlistLoading, toggleWishlist } = useContext(shopDataContext);

  const getTotalStock = p => {
    if (typeof p.stock === "number") return p.stock;
    if (p.stock && typeof p.stock === "object") {
      const obj = p.stock.toObject ? p.stock.toObject() : { ...p.stock };
      return Object.values(obj).reduce((s, v) => s + (Number(v) || 0), 0);
    }
    return 0;
  };

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center" style={{ paddingTop: "var(--nav-height)" }}>
        <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-[var(--ink)] opacity-60 animate-pulse">OneCart</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-14">

        {/* Header */}
        <div className="border-b border-[var(--border)] pb-8 mb-10 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">Saved items</p>
            <h1 className="font-display font-light text-[var(--ink)]" style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
              Wishlist
            </h1>
          </div>
          <p className="text-[12px] text-[var(--ink-40)]">{wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Empty */}
        {wishlistItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 h-12 border border-[var(--border-md)] flex items-center justify-center mb-8 text-[var(--ink-20)]">
              <FiHeart size={20} />
            </div>
            <h2 className="font-display font-light text-[var(--ink)] mb-3" style={{ fontSize: "clamp(22px, 3vw, 34px)" }}>
              Nothing saved yet.
            </h2>
            <p className="text-[13px] font-light text-[var(--ink-40)] mb-10 max-w-[36ch] leading-relaxed">
              Browse our collections and save the pieces you love.
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--ink-60)] transition-colors"
            >
              Explore Collections <FiArrowRight size={11} />
            </Link>
          </div>
        )}

        {/* Grid */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-10">
            {wishlistItems.map(item => {
              const totalStock = getTotalStock(item);
              const outOfStock = totalStock <= 0;
              const lowStock   = !outOfStock && totalStock <= 3;

              return (
                <div key={item._id} className="group relative">
                  {/* Remove */}
                  <button
                    onClick={() => toggleWishlist(item)}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 z-20 w-7 h-7 bg-white/90 border border-[var(--border)] flex items-center justify-center text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors"
                  >
                    <FiX size={13} />
                  </button>

                  {/* Image */}
                  <div
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                    className="relative aspect-[3/4] overflow-hidden bg-[#EEECEA] cursor-pointer"
                  >
                    <img
                      src={item.image1}
                      alt={item.name}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${outOfStock ? "opacity-50" : ""}`}
                    />
                    {lowStock && !outOfStock && (
                      <div className="absolute top-3 left-3 bg-[var(--ink)] text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5">
                        Only {totalStock} left
                      </div>
                    )}
                    {outOfStock && (
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <span className="bg-[var(--ink)] text-white text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5">Sold Out</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-3 space-y-0.5">
                    <button
                      onClick={() => navigate(`/productdetail/${item._id}`)}
                      className="text-[13px] font-light text-[var(--ink)] hover:text-[var(--ink-60)] transition-colors text-left w-full truncate block"
                    >
                      {item.name}
                    </button>
                    <p className="text-[13px] font-medium text-[var(--ink)] tabular-nums">{currency}{item.price}</p>
                  </div>

                  {/* Add to bag */}
                  <button
                    disabled={outOfStock}
                    onClick={() => {
                      const s = item.sizes?.[0];
                      if (s) addToCart(item._id, s);
                    }}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-[var(--border-md)] text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-60)] hover:bg-[var(--ink)] hover:text-white hover:border-[var(--ink)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiShoppingBag size={12} />
                    Add to Bag
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <OurPolicy />
    </div>
  );
}
