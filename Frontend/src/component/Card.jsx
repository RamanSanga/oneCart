import React, { useContext, useMemo, useState } from "react";
import { shopDataContext } from "../Context/ShopContext";
import { useNavigate }     from "react-router-dom";
import { FiHeart }         from "react-icons/fi";
import QuickView           from "./QuickView";

function Card({ name, image, hoverImage, id, price }) {
  const { currency, products, toggleWishlist, isWishlisted, addToCart } = useContext(shopDataContext);
  const navigate = useNavigate();

  const [showQuickView, setShowQuickView] = useState(false);
  const [hovered,       setHovered]       = useState(false);

  const product    = useMemo(() => products?.find(p => p._id === id), [products, id]);
  const wishlisted = isWishlisted(id);

  /* ── Total stock ── */
  let totalStock = null;
  if (product) {
    if (typeof product.stock === "number") {
      totalStock = product.stock;
    } else if (product.stock && typeof product.stock === "object") {
      totalStock = Object.values({ ...product.stock }).reduce((s, v) => s + (Number(v) || 0), 0);
    }
  }
  const outOfStock = typeof totalStock === "number" && totalStock <= 0;
  const secondImg  = hoverImage || product?.image2 || null;

  const handleWishlist = e => {
    e.stopPropagation();
    toggleWishlist(product || { _id: id, name, image1: image, price });
  };

  const handleQuickAdd = e => {
    e.stopPropagation();
    if (!product) return;
    if (product.sizes?.length > 1) setShowQuickView(true);
    else if (product.sizes?.length === 1) addToCart(id, product.sizes[0]);
    else navigate(`/productdetail/${id}`);
  };

  return (
    <>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate(`/productdetail/${id}`)}
      >
        {/* ── IMAGE ── */}
        <div className="relative w-full overflow-hidden bg-[#EEECEA]" style={{ aspectRatio: "3/4" }}>
          <img
            src={image}
            alt={name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered && secondImg ? "opacity-0" : "opacity-100"}`}
          />
          {secondImg && (
            <img
              src={secondImg}
              alt={name}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
            />
          )}

          {/* Out of stock */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-60)]">Sold Out</span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-20 w-7 h-7 bg-white/85 backdrop-blur-sm flex items-center justify-center transition-opacity ${hovered ? "opacity-100" : "opacity-0"}`}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiHeart
              size={13}
              fill={wishlisted ? "currentColor" : "none"}
              className={wishlisted ? "text-[var(--ink)]" : "text-[var(--ink-60)]"}
            />
          </button>

          {/* Quick add */}
          {!outOfStock && (
            <button
              onClick={handleQuickAdd}
              className={`absolute bottom-0 left-0 right-0 z-20 bg-[var(--ink)] text-white py-3 text-[9px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:bg-[var(--ink-80)] ${
                hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
            >
              {product?.sizes?.length > 1 ? "Select Size" : "Add to Bag"}
            </button>
          )}
        </div>

        {/* ── INFO ── */}
        <div className="mt-3 space-y-0.5">
          <h3 className="text-[13px] font-light text-[var(--ink)] truncate leading-snug">{name}</h3>
          <p className="text-[13px] font-medium text-[var(--ink)] tabular-nums">{currency}{price}</p>
        </div>
      </div>

      {showQuickView && (
        <QuickView productId={id} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}

export default React.memo(Card);
