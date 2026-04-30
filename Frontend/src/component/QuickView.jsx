import React, { useState, useContext, useEffect } from "react";
import { FiX, FiShoppingBag, FiHeart, FiArrowRight } from "react-icons/fi";
import { shopDataContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

function QuickView({ productId, onClose }) {
  const { products, currency, addToCart, toggleWishlist, isWishlisted } = useContext(shopDataContext);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const item = products.find((p) => p._id === productId);
    if (item) {
      setProduct(item);
      if (item.sizes?.length > 0) setSelectedSize(item.sizes[0]);
    }
  }, [productId, products]);

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!selectedSize) return;
    setPending(true);
    await addToCart(productId, selectedSize);
    setPending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* OVERLAY */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* MODAL */}
      <div className="relative bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-gray-500 hover:text-black transition-all hover:scale-110"
        >
          <FiX size={20} />
        </button>

        {/* IMAGE */}
        <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-[600px] overflow-hidden bg-gray-50">
          <img src={product.image1} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* INFO */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Quick Shop</p>
          <h2 className="text-3xl font-light tracking-tight text-gray-950 mb-4">{product.name}</h2>
          <p className="text-xl font-semibold text-gray-900 mb-8">{currency}{product.price}</p>
          
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-4">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-[48px] rounded-xl border-2 transition-all flex items-center justify-center text-xs font-medium ${selectedSize === size ? "border-black bg-black text-white shadow-lg" : "border-gray-100 bg-white text-gray-900 hover:border-gray-200"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={pending}
              className="w-full bg-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800 transition flex items-center justify-center gap-3"
            >
              <FiShoppingBag size={16} />
              {pending ? "Adding..." : "Add to Bag"}
            </button>
            
            <Link
              to={`/productdetail/${productId}`}
              onClick={onClose}
              className="w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black hover:bg-gray-50 transition flex items-center justify-center gap-2 group"
            >
              Full Product Details
              <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickView;
