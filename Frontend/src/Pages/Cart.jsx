import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../Context/shopContext";
import { FiMinus, FiPlus, FiTrash2, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const {
    products,
    cartItem,
    currency,
    delivery_fee,
    updateQuantity,
    removeCartItem,
    getCartAmount,
  } = useContext(shopDataContext);

  const [cartProducts, setCartProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  /* ================= BUILD CART PRODUCTS ================= */
  useEffect(() => {
    const items = [];

    for (const productId in cartItem) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const size in cartItem[productId]) {
        const qty = cartItem[productId][size];
        if (qty > 0) {
          items.push({
            ...product,
            size,
            quantity: qty,
          });
        }
      }
    }

    setCartProducts(items);
  }, [cartItem, products]);

  /* ================= SUBTOTAL ================= */
  useEffect(() => {
    const calcAmount = async () => {
      const amount = await getCartAmount();
      setSubTotal(amount);
    };
    calcAmount();
  }, [cartItem, getCartAmount]);

  /* ================= MOVE TO WISHLIST ================= */
  const moveToWishlist = (item) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    // prevent duplicates
    if (!wishlist.includes(item._id)) {
      wishlist.push(item._id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("storage")); // update navbar count
    }

    // remove from cart
    removeCartItem(item._id, item.size);
  };

  return (
    <section className="pt-[120px] pb-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <h1 className="text-2xl font-light tracking-wide mb-12">
          Shopping Bag
        </h1>

        {/* ================= EMPTY CART ================= */}
        {cartProducts.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-[180px] h-[220px] mb-10 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Empty Bag
            </div>

            <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-4">
              Your shopping bag is empty
            </h2>

            <p className="text-gray-500 text-sm md:text-base max-w-md mb-10">
              Discover refined essentials curated for a modern wardrobe.
            </p>

            <button
              onClick={() => navigate("/collection")}
              className="px-10 py-3 bg-black text-white text-sm tracking-wide hover:opacity-90 transition"
            >
              Explore Collection
            </button>
          </div>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

            {/* ================= LEFT: ITEMS ================= */}
            <div className="lg:col-span-2 space-y-12">

              {cartProducts.map((item) => (
                <div
                  key={`${item._id}-${item.size}`}
                  className="flex gap-6 border-b border-gray-200 pb-12"
                >
                  {/* IMAGE */}
                  <img
                    src={item.image1}
                    alt={item.name}
                    className="w-[120px] h-[160px] object-cover rounded-md"
                  />

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.size}
                      </p>

                      <p className="text-sm mt-2">
                        {currency}{item.price}
                      </p>
                    </div>

                    {/* ACTION BAR */}
                    <div className="flex flex-wrap items-center justify-between mt-6 gap-4">

                      {/* QUANTITY */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeCartItem(item._id, item.size);
                            } else {
                              updateQuantity(
                                item._id,
                                item.size,
                                item.quantity - 1
                              );
                            }
                          }}
                          className="border px-2 py-1 hover:bg-gray-100"
                        >
                          <FiMinus />
                        </button>

                        <span className="text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="border px-2 py-1 hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      {/* PREMIUM ACTIONS */}
                      <div className="flex items-center gap-6 text-xs uppercase tracking-widest">

                        {/* 🤍 MOVE TO WISHLIST */}
                        <button
                          onClick={() => moveToWishlist(item)}
                          className="flex items-center gap-2 text-gray-500 hover:text-black transition"
                        >
                          <FiHeart />
                          <span>Move to Wishlist</span>
                        </button>

                        {/* 🗑 REMOVE */}
                        <button
                          onClick={() =>
                            removeCartItem(item._id, item.size)
                          }
                          className="flex items-center gap-2 text-gray-400 hover:text-black transition"
                        >
                          <FiTrash2 />
                          <span>Remove</span>
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= RIGHT: SUMMARY ================= */}
            <div className="border border-gray-200 p-8 h-fit">
              <p className="text-sm tracking-wide uppercase mb-6">
                Order Summary
              </p>

              <div className="flex justify-between text-sm mb-4">
                <span>Subtotal</span>
                <span>{currency}{subTotal}</span>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span>Delivery</span>
                <span>{currency}{delivery_fee}</span>
              </div>

              <div className="border-t border-gray-200 my-6" />

              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>{currency}{subTotal + delivery_fee}</span>
              </div>

              <button
                onClick={() => navigate("/placeorder")}
                className="w-full mt-8 bg-black text-white py-3 text-sm tracking-wide hover:opacity-90 transition"
              >
                Proceed to Checkout
              </button>

            </div>

          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;
