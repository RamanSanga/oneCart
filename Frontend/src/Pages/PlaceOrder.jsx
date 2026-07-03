import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../Context/ShopContext";
import { userDataContext } from "../Context/UserContext";
import { authDataContext } from "../Context/AuthContext.jsx";
import { useNavigate }     from "react-router-dom";
import razorpayImg from "../assets/razorpay.png";
import axios       from "axios";
import { useToast } from "../Context/ToastContext";
import { FiArrowRight, FiShield, FiTruck } from "react-icons/fi";

const FIELDS = [
  { name: "firstName",  label: "First Name",   span: false },
  { name: "lastName",   label: "Last Name",    span: false },
  { name: "email",      label: "Email",        span: true  },
  { name: "phone",      label: "Phone",        span: true  },
  { name: "street",     label: "Street Address", span: true },
  { name: "city",       label: "City",         span: false },
  { name: "state",      label: "State",        span: false },
  { name: "pincode",    label: "PIN Code",     span: false },
  { name: "country",    label: "Country",      span: false },
];

export default function PlaceOrder() {
  const navigate = useNavigate();
  const toast    = useToast();

  const {
    cartItem, products, currency, delivery_fee,
    getCartAmount, setCartItem, getStockForSize,
    productsLoading, discountAmount: couponDiscount,
  } = useContext(shopDataContext);

  const { userData, getCurrentUser } = useContext(userDataContext);
  const { serverUrl }                = useContext(authDataContext);

  const [method,       setMethod]       = useState("cod");
  const [cartProducts, setCartProducts] = useState([]);
  const [subTotal,     setSubTotal]     = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [formData,     setFormData]     = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", pincode: "", country: "", phone: "",
  });

  const isFirstOrderDiscount = userData?.email?.endsWith("@gmail.com") && userData?.discountUsed === false;
  const firstOrderDisc       = isFirstOrderDiscount ? subTotal * 0.2 : 0;
  const total = subTotal - firstOrderDisc - (couponDiscount || 0) + (delivery_fee || 0);

  useEffect(() => {
    const items = [];
    for (const pid in cartItem) {
      const p = products.find(x => x._id === pid);
      if (!p) continue;
      for (const size in cartItem[pid]) {
        const qty = cartItem[pid][size];
        if (qty > 0) items.push({ _id: p._id, name: p.name, price: p.price, size, quantity: qty, image1: p.image1 });
      }
    }
    setCartProducts(items);
  }, [cartItem, products]);

  useEffect(() => {
    setSubTotal(getCartAmount() || 0);
  }, [cartItem, getCartAmount]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const loadRazorpay = () => new Promise(resolve => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const s = document.createElement("script");
    s.id    = "razorpay-script";
    s.src   = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const placeOrder = async () => {
    if (cartProducts.length === 0) return;
    const missing = Object.entries(formData).filter(([k, v]) => !v).map(([k]) => k);
    if (missing.length) {
      toast.error({ title: "Missing details", message: "Please fill in all delivery fields." });
      return;
    }

    setLoading(true);

    for (const item of cartProducts) {
      const p       = products.find(x => x._id === item._id);
      const inStock = getStockForSize(p, item.size);
      if (inStock < item.quantity) {
        toast.error({ title: "Stock changed", message: `${item.name} (${item.size}) is no longer available in the requested quantity.` });
        setLoading(false);
        return;
      }
    }

    try {
      const amountToPay = Math.max(0, total);

      if (method === "cod") {
        const res = await axios.post(`${serverUrl}/api/order/placeorder`,
          { address: formData, paymentMethod: "cod", items: cartProducts, amount: amountToPay },
          { withCredentials: true }
        );
        if (res.status === 200 || res.status === 201) {
          setCartItem({});
          await getCurrentUser();
          navigate("/ordersuccess");
        }
        return;
      }

      // Razorpay
      const createRes = await axios.post(`${serverUrl}/api/rajor/create-order`,
        { amount: amountToPay, items: cartProducts, address: formData },
        { withCredentials: true }
      );
      const { razorpayOrder, orderId, keyId } = createRes.data;
      if (!razorpayOrder || !orderId) throw new Error("Failed to create payment order");

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Failed to load Razorpay");

      new window.Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "OneCart",
        description: "Secure Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name:    `${formData.firstName} ${formData.lastName}`.trim() || userData?.name || "",
          email:   formData.email  || userData?.email || "",
          contact: formData.phone  || "",
        },
        handler: async response => {
          try {
            await axios.post(`${serverUrl}/api/rajor/verify`,
              { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, orderId },
              { withCredentials: true }
            );
            setCartItem({});
            await getCurrentUser();
            navigate("/ordersuccess");
          } catch {
            toast.error({ title: "Verification failed", message: "Contact support if amount was debited." });
          }
        },
        theme: { color: "#0A0A0A" },
      }).open();
    } catch (err) {
      toast.error({ title: "Order failed", message: err?.response?.data?.message || err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-14">

        {/* Header */}
        <div className="border-b border-[var(--border)] pb-8 mb-12">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">OneCart</p>
          <h1 className="font-display font-light text-[var(--ink)]" style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
            Checkout
          </h1>
        </div>

        {/* First order banner */}
        {isFirstOrderDiscount && (
          <div className="mb-10 border border-[var(--border-md)] bg-white px-6 py-4 flex items-center gap-4">
            <div className="w-7 h-7 bg-[var(--ink)] text-white flex items-center justify-center text-[11px] font-bold shrink-0">%</div>
            <div>
              <p className="text-[12px] font-medium text-[var(--ink)]">First order discount applied</p>
              <p className="text-[11px] font-light text-[var(--ink-40)]">20% off for new members · saving {currency}{firstOrderDisc.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── DELIVERY FORM ── */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <FiTruck size={14} className="text-[var(--ink-40)]" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)]">Delivery Details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
              {FIELDS.map(field => (
                <div key={field.name} className={field.span ? "sm:col-span-2" : ""}>
                  <label className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    type={field.name === "email" ? "email" : field.name === "phone" ? "tel" : "text"}
                    className="input-underline"
                    placeholder={field.label}
                    autoComplete={field.name === "email" ? "email" : field.name === "phone" ? "tel" : "off"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[var(--border)] p-8 sticky" style={{ top: "calc(var(--nav-height) + 24px)" }}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-8">Order Summary</p>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-52 overflow-y-auto no-scrollbar">
                {cartProducts.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-[#EEECEA] shrink-0 overflow-hidden">
                      <img src={item.image1} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-light text-[var(--ink)] truncate">{item.name}</p>
                      <p className="text-[10px] text-[var(--ink-40)] uppercase tracking-widest">Size {item.size} · ×{item.quantity}</p>
                    </div>
                    <p className="text-[12px] font-medium text-[var(--ink)] tabular-nums shrink-0">{currency}{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 text-[12px] border-t border-[var(--border)] pt-5 mb-6">
                <div className="flex justify-between text-[var(--ink-60)]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{currency}{subTotal.toFixed(2)}</span>
                </div>
                {isFirstOrderDiscount && (
                  <div className="flex justify-between text-[var(--ink)]">
                    <span>First Order (−20%)</span>
                    <span className="tabular-nums">−{currency}{firstOrderDisc.toFixed(2)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[var(--ink)]">
                    <span>Promo</span>
                    <span className="tabular-nums">−{currency}{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--ink-60)]">
                  <span>Shipping</span>
                  <span className="tabular-nums">{currency}{delivery_fee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[var(--border)] pt-2.5 flex justify-between font-medium text-[var(--ink)] text-[14px]">
                  <span>Total</span>
                  <span className="tabular-nums">{currency}{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment methods */}
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-4">Payment Method</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  onClick={() => setMethod("razorpay")}
                  aria-pressed={method === "razorpay"}
                  className={`relative h-14 border flex items-center justify-center px-3 transition-colors ${
                    method === "razorpay" ? "border-[var(--ink)] bg-[var(--ink-06)]" : "border-[var(--border-md)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <img src={razorpayImg} alt="Razorpay" className="h-5 object-contain" />
                  {method === "razorpay" && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--ink)]" />}
                </button>
                <button
                  onClick={() => setMethod("cod")}
                  aria-pressed={method === "cod"}
                  className={`relative h-14 border flex flex-col items-center justify-center transition-colors ${
                    method === "cod" ? "border-[var(--ink)] bg-[var(--ink-06)]" : "border-[var(--border-md)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ink)]">Cash on Delivery</p>
                  {method === "cod" && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--ink)]" />}
                </button>
              </div>

              {/* Place order */}
              <button
                onClick={placeOrder}
                disabled={loading || productsLoading || cartProducts.length === 0}
                className="w-full bg-[var(--ink)] text-white py-4 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--ink-80)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {loading ? "Processing…" : productsLoading ? "Loading bag…" : "Place Order"}
                <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[var(--ink-30)]">
                <FiShield size={12} />
                <p className="text-[9px] font-medium uppercase tracking-widest">SSL Encrypted Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
