import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../Context/ShopContext";
import { userDataContext } from "../Context/UserContext";
import { authDataContext } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import razorpayImg from "../assets/razorpay.png";
import axios from "axios";
import { useToast } from "../Context/ToastContext";
import { FiArrowRight, FiShield, FiTruck, FiCreditCard } from "react-icons/fi";

function PlaceOrder() {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    cartItem,
    products,
    currency,
    delivery_fee,
    getCartAmount,
    setCartItem,
    getStockForSize,
    productsLoading,
    discountAmount: couponDiscount,
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
    console.log("placeOrderHandler called");
    console.log("cartProducts:", cartProducts);
    if (cartProducts.length === 0) {
      console.log("Cart is empty");
      return;
    }
    
    // Simple validation
    const requiredFields = ["firstName", "lastName", "email", "street", "city", "state", "pincode", "country", "phone"];
    const missingFields = requiredFields.filter(f => !formData[f]);
    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      toast.error({ title: "Missing Information", message: "Please fill in all delivery details." });
      return;
    }

    setLoading(true);

    // Final Stock Check
    for (const item of cartProducts) {
      const product = products.find(p => p._id === item._id);
      const available = getStockForSize(product, item.size);
      if (available < item.quantity) {
        toast.error({ 
          title: "Stock Changed", 
          message: `${item.name} (${item.size}) is no longer available in the requested quantity.` 
        });
        setLoading(false);
        return;
      }
    }

    try {
      const amountToPay = subTotal - discountAmount - (couponDiscount || 0) + (delivery_fee || 0);

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
          toast.success({ title: "Order Placed", message: "Your order has been successfully placed!" });
          navigate("/ordersuccess");
        }
        return;
      }

      // Razorpay flow
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
        description: "Secure Order Payment",
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
            toast.success({ title: "Payment Successful", message: "Your order is being processed." });
            navigate("/ordersuccess");
          } catch (err) {
            toast.error({ title: "Verification Failed", message: "Please contact support for your payment." });
          }
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error({ 
        title: "Order Failed", 
        message: error?.response?.data?.message || error.message || "Something went wrong." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-[120px] pb-32 bg-[#faf9f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        <div className="flex flex-col md:flex-row items-center gap-4 mb-16">
           <div className="h-[1px] w-12 bg-black hidden md:block" />
           <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-950">Complete <span className="italic">Order</span></h1>
        </div>

        {isFirstOrderDiscount && (
          <div className="mb-12 rounded-[24px] bg-emerald-50 border border-emerald-100 p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
              <span className="font-bold text-sm">%</span>
            </div>
            <div>
              <p className="text-emerald-900 font-medium">Welcome Discount Applied!</p>
              <p className="text-emerald-600 text-sm">20% off your first order as a new member.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* DELIVERY INFO */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)]">
              <h2 className="text-xl font-medium tracking-widest uppercase text-gray-400 mb-10 flex items-center gap-3">
                <FiTruck size={20} className="text-black" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formData).map((key) => (
                  <div key={key} className={key === "email" || key === "street" || key === "phone" ? "md:col-span-2" : ""}>
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY & PAYMENT */}
          <div className="lg:col-span-5 space-y-8">
            {/* ORDER SUMMARY */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)]">
              <h2 className="text-xl font-medium tracking-widest uppercase text-gray-400 mb-8">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span className="text-sm uppercase tracking-widest">Subtotal</span>
                  <span className="font-medium text-gray-950">{currency}{subTotal.toFixed(2)}</span>
                </div>

                {isFirstOrderDiscount && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="text-sm uppercase tracking-widest">First Order (20%)</span>
                    <span className="font-medium">- {currency}{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span className="text-sm uppercase tracking-widest">Delivery</span>
                  <span className="font-medium text-gray-950">{currency}{delivery_fee.toFixed(2)}</span>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="font-medium text-gray-900 uppercase tracking-widest">Total to pay</span>
                  <span className="text-3xl font-semibold text-gray-950">
                    {currency}{(subTotal - discountAmount - (couponDiscount || 0) + (delivery_fee || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* PAYMENT METHODS */}
              <h2 className="text-xl font-medium tracking-widest uppercase text-gray-400 mb-6 flex items-center gap-3">
                 <FiCreditCard size={18} className="text-black" />
                 Payment Method
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <button 
                  onClick={() => setMethod("razorpay")} 
                  className={`relative h-20 rounded-3xl border-2 transition-all flex items-center justify-center p-4 ${method === "razorpay" ? "border-black bg-gray-50" : "border-gray-100 bg-white"}`}
                >
                  <img src={razorpayImg} alt="razorpay" className="h-full object-contain" />
                  {method === "razorpay" && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-black" />}
                </button>

                <button 
                  onClick={() => setMethod("cod")} 
                  className={`relative h-20 rounded-3xl border-2 transition-all flex flex-col items-center justify-center ${method === "cod" ? "border-black bg-gray-50" : "border-gray-100 bg-white"}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Cash on Delivery</span>
                  {method === "cod" && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-black" />}
                </button>
              </div>

              <button 
                onClick={placeOrderHandler} 
                disabled={loading || productsLoading || cartProducts.length === 0} 
                className="w-full bg-black text-white py-6 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {loading ? "Processing..." : productsLoading ? "Loading Bag..." : "Place Order"}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 flex items-center justify-center gap-3 text-gray-400">
                <FiShield size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlaceOrder;
