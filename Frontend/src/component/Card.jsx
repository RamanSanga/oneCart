import React, { useContext, useMemo, useState } from "react";
import { shopDataContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import QuickView from "./QuickView";
import { motion } from "framer-motion";

function Card({ name, image, id, price }) {
  const { currency, products, toggleWishlist, isWishlisted, addToCart } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [showQuickView, setShowQuickView] = useState(false);

  const product = useMemo(() => products?.find((p) => p._id === id), [products, id]);
  const wishlisted = isWishlisted(id);

  let stock = null;
  if (product) {
    if (typeof product.stock === "number") {
      stock = product.stock;
    } else if (product.stock && typeof product.stock === "object") {
      const plain = product.stock.toObject ? product.stock.toObject() : { ...product.stock };
      const values = Object.values(plain).map((v) => Number(v) || 0);
      stock = values.reduce((a, b) => a + b, 0);
    }
  }

  const lowStock = typeof stock === "number" && stock > 0 && stock <= 3;
  const outOfStock = typeof stock === "number" && stock <= 0;

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product || { _id: id, name, image1: image, price });
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (product?.sizes?.length > 1) {
      setShowQuickView(true);
    } else if (product?.sizes?.length === 1) {
      addToCart(id, product.sizes[0]);
    } else {
      navigate(`/productdetail/${id}`);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.005 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="group cursor-pointer relative overflow-hidden bg-linear-to-b from-[#05050a] via-[#08090d] to-[#101216] rounded-4xl p-3 border border-white/6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
        onClick={() => navigate(`/productdetail/${id}`)}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,transparent,rgba(255,255,255,0.03))]" />
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-4/5 overflow-hidden bg-[#0b0d11] rounded-3xl">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
            loading="lazy"
          />
          
          {/* OVERLAYS */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-80" />
          <div className="absolute inset-0 bg-black/8 group-hover:bg-black/16 transition-colors duration-500" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/70 to-transparent" />
          
          {/* ACTIONS */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleWishlist}
              className="bg-white/8 backdrop-blur-md p-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10"
            >
              <Heart
                size={18}
                className={`transition-colors duration-300 ${
                  wishlisted ? "fill-red-500 text-red-500" : "text-white/90"
                }`}
              />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowQuickView(true); }}
              className="bg-white/8 backdrop-blur-md p-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10"
            >
              <Eye size={18} className="text-white/90" />
            </button>
          </div>

          <button
            onClick={handleQuickAdd}
            className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md py-3 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black border border-white/10"
          >
            <ShoppingBag size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              {product?.sizes?.length > 1 ? "Quick View" : "Quick Add"}
            </span>
          </button>

          {lowStock && (
            <div className="absolute top-4 left-4 z-10 bg-black/45 backdrop-blur-md text-yellow-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm border border-white/10">
              Only {stock} left
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="mt-5 px-2 pb-2 text-center">
          <p className="text-[10px] font-semibold tracking-[0.36em] text-white/35 uppercase mb-2">
            OneCart Exclusive
          </p>
          <h3 className="text-[15px] md:text-[16px] font-medium tracking-[-0.02em] text-white truncate px-2 mb-2">
            {name}
          </h3>
          <p className="text-lg font-semibold text-white">
            {currency} {price}
          </p>
        </div>
      </motion.div>

      {showQuickView && (
        <QuickView productId={id} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}

export default Card;
