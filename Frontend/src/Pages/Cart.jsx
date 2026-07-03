import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shopDataContext } from "../Context/ShopContext";
import { userDataContext } from "../Context/UserContext";
import { FiTrash2, FiMinus, FiPlus, FiHeart } from "react-icons/fi";
import OurPolicy from "../component/OurPolicy";

export default function Cart() {
  const {
    products, cartItem, currency, delivery_fee,
    updateQuantity, getCartAmount, removeCartItem, getStockForSize,
    toggleWishlist, isWishlisted,
    applyCoupon, removeCoupon, appliedCoupon, discountAmount: couponDiscount,
  } = useContext(shopDataContext);

  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();
  const couponRef = useRef(null);

  const isFirstOrderDiscount = userData?.email?.endsWith("@gmail.com") && userData?.discountUsed === false;
  const firstOrderDiscount = isFirstOrderDiscount ? getCartAmount() * 0.2 : 0;

  const [cartData, setCartData] = useState([]);
  const [hasOutOfStock, setHasOutOfStock] = useState(false);

  useEffect(() => {
    if (!products.length) return;
    const temp = [];
    let outOfStock = false;
    for (const id in cartItem) {
      for (const size in cartItem[id]) {
        if (cartItem[id][size] > 0) {
          const product = products.find(p => p._id === id);
          const stock   = getStockForSize(product, size);
          if (stock < cartItem[id][size]) outOfStock = true;
          temp.push({ _id: id, size, quantity: cartItem[id][size], stock });
        }
      }
    }
    setCartData(temp);
    setHasOutOfStock(outOfStock);
  }, [cartItem, products, getStockForSize]);

  const subtotal = getCartAmount();
  const discount = firstOrderDiscount + (couponDiscount || 0);
  const total    = subtotal > 0 ? subtotal - discount + delivery_fee : 0;

  const handleMoveToWishlist = async (item, productData) => {
    if (!productData) return;
    if (isWishlisted(productData._id)) { navigate("/wishlist"); return; }
    await toggleWishlist(productData);
    await removeCartItem(item._id, item.size);
  };

  /* ── EMPTY STATE ── */
  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center text-center px-6"
           style={{ paddingTop: "var(--nav-height)" }}>
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-6">Your Shopping Bag</p>
        <h1 className="font-display font-light text-[var(--ink)] mb-4"
            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
          Your bag is empty.
        </h1>
        <p className="text-[13px] font-light text-[var(--ink-60)] mb-10 max-w-[40ch]">
          Discover our curated collections and find pieces worth keeping.
        </p>
        <Link to="/collection"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--ink-60)] transition-colors">
          Browse Collections →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--cream)] min-h-screen" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-12">

        {/* header */}
        <div className="flex items-end justify-between mb-10 border-b border-[var(--border)] pb-6">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">OneCart</p>
            <h1 className="font-display font-light text-[var(--ink)] leading-tight"
                style={{ fontSize: "clamp(24px, 3vw, 40px)" }}>
              Shopping Bag
            </h1>
          </div>
          <p className="text-[12px] text-[var(--ink-40)]">{cartData.length} item{cartData.length !== 1 ? "s" : ""}</p>
        </div>

        {/* out of stock warning */}
        {hasOutOfStock && (
          <div className="mb-8 px-4 py-3 bg-white border border-[var(--border-md)] flex items-center gap-3">
            <div className="h-4 w-4 bg-[var(--ink)] text-white flex items-center justify-center text-[9px] font-bold shrink-0">!</div>
            <p className="text-[11px] text-[var(--ink-60)]">Some items are no longer available in the requested quantity. Please update your bag to continue.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── ITEMS ── */}
          <div className="lg:col-span-8">
            {/* column headers — desktop only */}
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-3 border-b border-[var(--border)]">
              <p className="col-span-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)]">Product</p>
              <p className="col-span-2 text-center text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)]">Size</p>
              <p className="col-span-3 text-center text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)]">Quantity</p>
              <p className="col-span-2 text-right text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)]">Price</p>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {cartData.map(item => {
                const p = products.find(x => x._id === item._id);
                if (!p) return null;
                const isOOS = item.stock < item.quantity;

                return (
                  <div key={`${item._id}-${item.size}`} className="py-6 grid grid-cols-12 gap-4 items-center">
                    {/* image + name */}
                    <div className="col-span-12 md:col-span-5 flex items-center gap-5">
                      <div className={`w-16 h-20 md:w-20 md:h-24 shrink-0 overflow-hidden bg-[#EEECEA] ${isOOS ? "opacity-50" : ""}`}>
                        <img src={p.image1} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-[13px] font-light truncate mb-1 ${isOOS ? "text-[var(--ink-40)]" : "text-[var(--ink)]"}`}>{p.name}</h3>
                        {isOOS && <p className="text-[10px] font-semibold uppercase tracking-widest text-red-500">Sold Out</p>}
                        {/* mobile-only size */}
                        <p className="md:hidden text-[10px] text-[var(--ink-40)] mt-1">Size: {item.size}</p>
                        {/* actions */}
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => handleMoveToWishlist(item, p)}
                            className="text-[10px] font-medium text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors flex items-center gap-1.5"
                          >
                            <FiHeart size={11} className={isWishlisted(p._id) ? "fill-current" : ""} />
                            {isWishlisted(p._id) ? "Wishlisted" : "Save"}
                          </button>
                          <button
                            onClick={() => removeCartItem(item._id, item.size)}
                            className="text-[10px] font-medium text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors flex items-center gap-1.5"
                            aria-label="Remove item"
                          >
                            <FiTrash2 size={11} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* size */}
                    <div className="hidden md:flex col-span-2 justify-center">
                      <span className="text-[12px] font-medium text-[var(--ink)]">{item.size}</span>
                    </div>

                    {/* qty */}
                    <div className="col-span-7 md:col-span-3 flex items-center justify-start md:justify-center">
                      <div className="flex items-center border border-[var(--border-md)] bg-white">
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-[var(--ink-40)] hover:text-[var(--ink)] disabled:opacity-20 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={11} />
                        </button>
                        <span className="w-8 text-center text-[12px] font-medium text-[var(--ink)]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center text-[var(--ink-40)] hover:text-[var(--ink)] disabled:opacity-20 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={11} />
                        </button>
                      </div>
                    </div>

                    {/* price */}
                    <div className="col-span-5 md:col-span-2 text-right">
                      <p className="text-[13px] font-medium text-[var(--ink)]">{currency}{(p.price * item.quantity).toFixed(0)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <Link to="/collection"
                    className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[var(--border)] p-8 sticky top-[calc(var(--nav-height)+24px)]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-8">Order Summary</p>

              <div className="space-y-3 text-[12px] mb-6">
                <div className="flex justify-between text-[var(--ink-60)]">
                  <span>Subtotal</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>

                {isFirstOrderDiscount && (
                  <div className="flex justify-between text-[var(--ink)]">
                    <span>First Order (−20%)</span>
                    <span>−{currency}{firstOrderDiscount.toFixed(2)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[var(--ink)]">
                    <span className="flex items-center gap-2">
                      Promo {appliedCoupon && <span className="text-[9px] font-semibold uppercase bg-[var(--ink)] text-white px-1.5 py-0.5">{appliedCoupon}</span>}
                    </span>
                    <span>−{currency}{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--ink-60)]">
                  <span>Shipping</span>
                  <span>{currency}{delivery_fee.toFixed(2)}</span>
                </div>

                <div className="border-t border-[var(--border)] pt-3 flex justify-between text-[var(--ink)] font-medium text-[13px]">
                  <span>Total</span>
                  <span>{currency}{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="mb-8 border-t border-[var(--border)] pt-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--ink)]">"{appliedCoupon}" applied</span>
                    <button onClick={removeCoupon} className="text-[10px] text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors">Remove</button>
                  </div>
                ) : (
                  <div className="flex items-center border-b border-[var(--border-md)] pb-2 gap-3">
                    <input
                      ref={couponRef}
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 bg-transparent outline-none text-[12px] font-light text-[var(--ink)] placeholder:text-[var(--ink-30)]"
                      onKeyDown={e => { if (e.key === "Enter") { applyCoupon(e.target.value); e.target.value = ""; } }}
                    />
                    <button
                      onClick={() => { if (couponRef.current) { applyCoupon(couponRef.current.value); couponRef.current.value = ""; } }}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout */}
              <button
                onClick={() => navigate("/placeorder")}
                disabled={hasOutOfStock}
                className="w-full py-4 bg-[var(--ink)] text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--ink-80)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {hasOutOfStock ? "Resolve Issues to Continue" : "Proceed to Checkout →"}
              </button>

              <p className="mt-4 text-[9px] text-center text-[var(--ink-30)] uppercase tracking-widest">
                Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>

      <OurPolicy />
    </div>
  );
}
