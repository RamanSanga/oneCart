import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shopDataContext } from "../Context/ShopContext";
import { userDataContext } from "../Context/UserContext";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiHeart } from "react-icons/fi";
import Title from "../component/Title";

export default function Cart() {
  const {
    products,
    cartItem,
    currency,
    delivery_fee,
    updateQuantity,
    getCartAmount,
    removeCartItem,
    getStockForSize,
    toggleWishlist,
    isWishlisted,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    discountAmount: couponDiscount,
  } = useContext(shopDataContext);

  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();

  const isFirstOrderDiscount =
    userData?.email?.endsWith("@gmail.com") &&
    userData?.discountUsed === false;

  const firstOrderDiscountPercent = isFirstOrderDiscount ? 20 : 0;
  const [cartData, setCartData] = useState([]);
  const [hasOutOfStock, setHasOutOfStock] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      let outOfStockFound = false;
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const product = products.find(p => p._id === items);
            const stock = getStockForSize(product, item);
            if (stock < cartItem[items][item]) outOfStockFound = true;

            tempData.push({
              _id: items,
              size: item,
              quantity: cartItem[items][item],
              stock: stock
            });
          }
        }
      }
      setCartData(tempData);
      setHasOutOfStock(outOfStockFound);
    }
  }, [cartItem, products, getStockForSize]);

  const subtotal = getCartAmount();
  const total = subtotal > 0 ? subtotal + delivery_fee : 0;

  const handleWishlistMove = async (item, productData) => {
    if (!productData) return;

    const alreadyWishlisted = isWishlisted(productData._id);

    if (alreadyWishlisted) {
      navigate("/wishlist");
      return;
    }

    await toggleWishlist(productData);
    await removeCartItem(item._id, item.size);
  };

  if (cartData.length === 0) {
    return (
      <section className="min-h-screen pt-[150px] pb-20 bg-[#faf9f5]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="mb-10 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl text-gray-300">
            <FiShoppingBag size={40} />
          </div>
          <h1 className="text-4xl font-light tracking-tight text-gray-950 mb-6">Your bag is empty</h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            Discover our latest collections and find something that inspires your unique style.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-sm font-medium uppercase tracking-[0.2em] transition hover:bg-gray-800 shadow-2xl"
          >
            Start Shopping
            <FiArrowRight />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-[120px] pb-20 bg-[#faf9f5]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-black/10 hidden sm:block" />
              <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] text-black text-center uppercase">
                YOUR <span className="font-semibold text-black/80">SHOPPING BAG</span>
              </h2>
              <div className="h-px w-12 bg-black/10 hidden sm:block" />
            </div>
            <div className="h-1.5 w-12 bg-yellow-300 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.45)]" />
          </div>
        </div>

        {hasOutOfStock && (
          <div className="mb-10 p-4 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-900 animate-in fade-in slide-in-from-top-2">
            <div className="h-10 w-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">!</div>
            <p className="text-sm">Some items in your bag are no longer available in the requested quantity. Please update your bag to continue.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* ITEMS LIST */}
          <div className="lg:col-span-8 space-y-6">
            {cartData.map((item, index) => {
              const productData = products.find((p) => p._id === item._id);
              if (!productData) return null;

              const isOutOfStock = item.stock < item.quantity;
              const isLowStock = item.stock > 0 && item.stock <= 3 && item.stock >= item.quantity;

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className={`flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-4xl border transition-all hover:shadow-[0_15px_50px_rgba(0,0,0,0.05)] ${isOutOfStock ? "border-rose-200 bg-rose-50/30" : "border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]"}`}
                >
                  <div className="w-full sm:w-32 h-40 overflow-hidden rounded-2xl bg-gray-50 relative">
                    <img
                      src={productData.image1}
                      alt={productData.name}
                      className={`w-full h-full object-cover ${isOutOfStock ? "grayscale opacity-50" : ""}`}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                        <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg">Out of stock</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-light truncate max-w-[250px] ${isOutOfStock ? "text-gray-400" : "text-gray-950"}`}>
                          {productData.name}
                        </h3>
                        <p className={`text-lg font-medium ${isOutOfStock ? "text-gray-400" : "text-gray-950"}`}>
                          {currency} {productData.price}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <p className="text-sm text-gray-400 uppercase tracking-widest">
                          Size: <span className="text-gray-900 font-medium">{item.size}</span>
                        </p>
                        {isLowStock && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Only {item.stock} left</span>
                        )}
                        {isOutOfStock && item.stock > 0 && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Only {item.stock} available</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white transition-all text-gray-600 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white transition-all text-gray-600 disabled:opacity-30"
                            disabled={item.quantity >= item.stock}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleWishlistMove(item, productData)}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:border-black hover:text-black transition-all"
                          aria-label={isWishlisted(productData._id) ? "Open wishlist" : "Move item to wishlist"}
                        >
                          <FiHeart size={14} className={isWishlisted(productData._id) ? "fill-current text-black" : ""} />
                          {isWishlisted(productData._id) ? "In Wishlist" : "Move to Wishlist"}
                        </button>

                        <button
                          onClick={() => removeCartItem(item._id, item.size)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-6">
               <Link to="/collection" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                  <FiArrowRight className="rotate-180" />
                  Continue Shopping
               </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] sticky top-[120px]">
              <h2 className="text-2xl font-light tracking-tight text-gray-950 mb-8 text-center">Order Summary</h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex flex-col gap-5 py-6 border-b border-gray-50">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span>{currency}{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {isFirstOrderDiscount && (
                    <div className="flex justify-between text-green-600 text-sm font-medium">
                      <span>First Order Offer (20%)</span>
                      <span>-{currency}{(subtotal * 0.2).toFixed(2)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm font-medium">
                      <span className="flex items-center gap-2">
                         Promo Code {appliedCoupon && <span className="bg-green-50 px-2 py-0.5 rounded text-[10px] uppercase">{appliedCoupon}</span>}
                      </span>
                      <span>-{currency}{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Shipping</span>
                    <span>{currency}{delivery_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 text-lg font-semibold pt-4 border-t border-gray-50">
                    <span>Total</span>
                    <span>
                      {currency}
                      {(
                        subtotal - 
                        (isFirstOrderDiscount ? subtotal * 0.2 : 0) - 
                        couponDiscount + 
                        delivery_fee
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="py-8 border-b border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Promo Code</p>
                  {appliedCoupon ? (
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold tracking-widest">OK</div>
                           <span className="text-sm font-medium text-gray-950 uppercase">{appliedCoupon} Applied</span>
                        </div>
                        <button 
                          onClick={removeCoupon}
                          className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                     </div>
                  ) : (
                    <div className="relative group">
                      <input 
                        type="text" 
                        placeholder="Enter Code (e.g. SAVE10)"
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black/5 text-sm uppercase font-bold tracking-widest placeholder:normal-case placeholder:font-normal placeholder:tracking-normal transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            applyCoupon(e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          const input = e.currentTarget.previousSibling;
                          applyCoupon(input.value);
                          input.value = "";
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition hover:bg-gray-800"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  <p className="mt-3 text-[9px] text-gray-400 uppercase tracking-widest italic text-center">Try: SAVE10, ONECART20, or FLAT500</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/placeorder")}
                disabled={hasOutOfStock}
                className="w-full bg-black text-white py-5 rounded-full text-sm font-medium uppercase tracking-[0.2em] transition hover:bg-gray-800 shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasOutOfStock ? "Fix Bag to Continue" : "Proceed to Checkout"}
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>

              <div className="mt-8 flex flex-col gap-4">
                 <div className="flex items-center gap-4 text-xs text-gray-400 p-4 bg-gray-50 rounded-2xl">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Express delivery available for your area.</span>
                 </div>
                 <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                    Safe & Secure Checkout · Razorpay Protected
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
