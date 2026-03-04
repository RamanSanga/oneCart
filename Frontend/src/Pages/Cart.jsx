import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { shopDataContext } from "../Context/ShopContext";
import { authDataContext } from "../Context/AuthContext";
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

  const { serverUrl } = useContext(authDataContext);

  const [cartProducts, setCartProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  /* ================= PREMIUM TOAST ================= */

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

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

  const moveToWishlist = async (item) => {
    try {
      await axios.post(
        `${serverUrl}/api/wishlist/add`,
        { productId: item._id },
        { withCredentials: true }
      );

      await axios.post(
        `${serverUrl}/api/cart/update`,
        { itemId: item._id, size: item.size, quantity: 0 },
        { withCredentials: true }
      );

      window.location.reload();

    } catch (error) {
      showToast("Unable to move item to wishlist");
    }
  };

  return (
    <section className="pt-[120px] pb-32 bg-white min-h-screen">

      {/* PREMIUM TOAST */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50
        bg-white border border-gray-200 shadow-xl
        px-6 py-3 text-sm tracking-wide
        max-w-[90%] sm:max-w-sm text-center">

          {toast}

        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-2xl font-light tracking-wide mb-12">
          Shopping Bag
        </h1>

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

            <div className="lg:col-span-2 space-y-12">

              {cartProducts.map((item) => (

                <div
                  key={`${item._id}-${item.size}`}
                  className="flex gap-6 border-b border-gray-200 pb-12"
                >

                  <img
                    src={item.image1}
                    alt={item.name}
                    className="w-[120px] h-[160px] object-cover rounded-md"
                  />

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

                    <div className="flex flex-wrap items-center justify-between mt-6 gap-4">

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
                          onClick={async () => {

                            const result = await updateQuantity(
                              item._id,
                              item.size,
                              item.quantity + 1
                            );

                            if (result && !result.success) {
                              showToast(result.message);
                            }

                          }}
                          className="border px-2 py-1 hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>

                      </div>

                      <div className="flex items-center gap-6 text-xs uppercase tracking-widest">

                        <button
                          onClick={() => moveToWishlist(item)}
                          className="flex items-center gap-2 text-gray-500 hover:text-black transition"
                        >
                          <FiHeart />
                          <span>Move to Wishlist</span>
                        </button>

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
