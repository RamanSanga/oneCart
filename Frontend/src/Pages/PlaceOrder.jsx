import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../Context/shopContext";
import { userDataContext } from "../Context/userContext";
import { authDataContext } from "../Context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import razorpayImg from "../assets/Razorpay.png";
import axios from "axios";

function PlaceOrder() {
  const navigate = useNavigate();

  const {
    cartItem,
    products,
    currency,
    delivery_fee,
    getCartAmount,
    setCartItem,
  } = useContext(shopDataContext);

  const { userData, getCurrentUser } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [method, setMethod] = useState("cod");
  const [cartProducts, setCartProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const isFirstOrderDiscount =
    userData?.email?.endsWith("@gmail.com") &&
    userData?.discountUsed === false;

  const discountPercent = isFirstOrderDiscount ? 20 : 0;
  const discountAmount = (subTotal * discountPercent) / 100;

  useEffect(() => {
    const items = [];
    for (const productId in cartItem) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;
      for (const size in cartItem[productId]) {
        const qty = cartItem[productId][size];
        if (qty > 0) {
          items.push({ _id: product._id, name: product.name, price: product.price, size, quantity: qty, image1: product.image1 });
        }
      }
    }
    setCartProducts(items);
  }, [cartItem, products]);

  useEffect(() => {
    const calc = async () => {
      const amount = await getCartAmount();
      setSubTotal(amount || 0);
    };
    calc();
  }, [cartItem, getCartAmount]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const placeOrderHandler = async () => {
    if (cartProducts.length === 0) return;
    setLoading(true);

    try {
      const amountToPay = subTotal - discountAmount + (delivery_fee || 0);

      if (method === "cod") {
        const orderData = {
          address: formData,
          paymentMethod: "cod",
          items: cartProducts,
          amount: amountToPay,
        };
        const res = await axios.post(`${serverUrl}/api/order/placeorder`, orderData, { withCredentials: true });
        if (res.status === 200 || res.status === 201) {
          setCartItem({});
          await getCurrentUser();
          navigate("/ordersuccess");
        }
        setLoading(false);
        return;
      }

      // Razorpay flow using your rajor endpoints
      const createRes = await axios.post(
        `${serverUrl}/api/rajor/create-order`,
        { amount: amountToPay, items: cartProducts, address: formData },
        { withCredentials: true }
      );

      const { razorpayOrder, orderId, keyId } = createRes.data;
      if (!razorpayOrder || !orderId) throw new Error("Failed to create payment order");

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay checkout");

      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "OneCart",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim() || userData?.name || "",
          email: formData.email || userData?.email || "",
          contact: formData.phone || userData?.phone || "",
        },
        handler: async function (response) {
          try {
            await axios.post(
              `${serverUrl}/api/rajor/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              },
              { withCredentials: true }
            );

            setCartItem({});
            await getCurrentUser();
            navigate("/ordersuccess");
          } catch (err) {
            console.error("Payment verification failed:", err?.response?.data || err?.message);
            alert("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout dismissed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Place order error:", error?.response?.data || error.message);
      alert((error?.response?.data?.message) || error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-[120px] pb-32 bg-[#fafafa] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-light tracking-wide mb-16">Checkout</h1>

        {isFirstOrderDiscount && (
          <div className="mb-10 border border-green-300 bg-green-50 px-6 py-4">
            <p className="text-sm tracking-wide text-green-700">
              🎉 Welcome! 20% First Order Discount Applied
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-lg tracking-wide mb-10 uppercase">Delivery Information</h2>
            <div className="grid grid-cols-2 gap-6">
              {Object.keys(formData).map((key) => (
                <input
                  key={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
                  className={`input-minimal ${key === "email" || key === "street" || key === "phone" ? "col-span-2" : ""}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg tracking-wide mb-10 uppercase">Order Summary</h2>

            <div className="border border-gray-300 p-8 mb-12">
              <div className="flex justify-between mb-4 text-sm">
                <span>Subtotal</span>
                <span>{currency}{subTotal}</span>
              </div>

              {isFirstOrderDiscount && (
                <div className="flex justify-between mb-4 text-sm text-green-700">
                  <span>First Order Discount (20%)</span>
                  <span>- {currency}{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between mb-4 text-sm">
                <span>Shipping</span>
                <span>{currency}{delivery_fee}</span>
              </div>

              <div className="border-t my-6" />

              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>
                  {currency}
                  {subTotal - discountAmount + (delivery_fee || 0)}
                </span>
              </div>
            </div>

            <h2 className="text-lg tracking-wide mb-6 uppercase">Payment Method</h2>

            <div className="flex gap-6 mb-12">
              <button onClick={() => setMethod("razorpay")} className={`w-[140px] h-[50px] border ${method === "razorpay" ? "border-black" : "border-gray-300"}`}>
                <img src={razorpayImg} alt="razorpay" className="w-full h-full object-contain" />
              </button>

              <button onClick={() => setMethod("cod")} className={`px-8 h-[50px] border text-sm tracking-wide ${method === "cod" ? "border-black" : "border-gray-300"}`}>
                CASH ON DELIVERY
              </button>
            </div>

            <button onClick={placeOrderHandler} disabled={loading} className="w-full bg-black text-white py-4 text-sm tracking-widest hover:opacity-90 transition">
              {loading ? "Placing order..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlaceOrder;