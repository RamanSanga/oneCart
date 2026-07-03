import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../Context/AuthContext";
import { shopDataContext } from "../Context/ShopContext";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard } from "react-icons/fi";
import OurPolicy from "../component/OurPolicy";

const STATUS_STEPS = [
  { label: "Placed",     icon: FiClock },
  { label: "Processing", icon: FiPackage },
  { label: "Shipped",    icon: FiTruck },
  { label: "Delivered",  icon: FiCheckCircle },
];

const statusIndex = s => {
  const v = s?.toLowerCase();
  if (v === "delivered")  return 3;
  if (v === "shipped")    return 2;
  if (v === "processing") return 1;
  return 0;
};

export default function Order() {
  const { serverUrl } = useContext(authDataContext);
  const { currency }  = useContext(shopDataContext);
  const navigate      = useNavigate();
  const [orders,   setOrders]  = useState([]);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    if (!serverUrl) return;
    let mounted = true;
    setLoading(true);
    axios.get(`${serverUrl}/api/order/user`, { withCredentials: true })
      .then(res => { if (mounted) setOrders(Array.isArray(res.data) ? res.data : res.data?.orders || []); })
      .catch(() => { if (mounted) setOrders([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [serverUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center" style={{ paddingTop: "var(--nav-height)" }}>
        <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-[var(--ink)] opacity-60 animate-pulse">OneCart</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-14">

        {/* Header */}
        <div className="border-b border-[var(--border)] pb-8 mb-10">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">OneCart</p>
          <h1 className="font-display font-light text-[var(--ink)]" style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
            Order History
          </h1>
        </div>

        {/* Empty */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 h-12 border border-[var(--border-md)] flex items-center justify-center mb-8 text-[var(--ink-20)]">
              <FiPackage size={20} />
            </div>
            <h2 className="font-display font-light text-[var(--ink)] mb-3" style={{ fontSize: "clamp(22px, 3vw, 34px)" }}>
              No orders yet.
            </h2>
            <p className="text-[13px] font-light text-[var(--ink-40)] mb-10 max-w-[36ch] leading-relaxed">
              When you place an order, it will appear here for tracking.
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--ink-60)] transition-colors"
            >
              Start Shopping →
            </button>
          </div>
        )}

        {/* Orders list */}
        {orders.length > 0 && (
          <div className="space-y-10">
            {orders.map(order => {
              const idx         = statusIndex(order.status);
              const isFirstOrd  = order.discountPercent > 0;

              return (
                <div key={order._id} className="bg-white border border-[var(--border)]">

                  {/* Order meta */}
                  <div className="px-6 md:px-10 py-6 border-b border-[var(--border)] flex flex-wrap gap-8 justify-between items-start">
                    <div className="flex flex-wrap gap-10">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-1.5">Order ID</p>
                        <p className="text-[12px] font-medium text-[var(--ink)] tabular-nums">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-1.5">Date</p>
                        <p className="text-[12px] font-medium text-[var(--ink)]">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-1.5">Total</p>
                        <p className="text-[12px] font-medium text-[var(--ink)] tabular-nums">{currency}{order.amount.toFixed(2)}</p>
                      </div>
                    </div>
                    {isFirstOrd && (
                      <div className="text-[9px] font-semibold uppercase tracking-widest text-white bg-[var(--ink)] px-3 py-1.5 self-start">
                        First Order Offer
                      </div>
                    )}
                  </div>

                  {/* Progress tracker */}
                  <div className="px-6 md:px-10 py-10">
                    <div className="max-w-2xl mx-auto relative">
                      {/* track line */}
                      <div className="absolute top-4 left-4 right-4 h-px bg-[var(--border)]" />
                      <div
                        className="absolute top-4 left-4 h-px bg-[var(--ink)] transition-all duration-700"
                        style={{ width: `${idx === 0 ? 0 : idx === 1 ? 33 : idx === 2 ? 66 : 100}%` }}
                      />
                      <div className="relative flex justify-between">
                        {STATUS_STEPS.map((step, i) => {
                          const StepIcon = step.icon;
                          const active   = i <= idx;
                          return (
                            <div key={step.label} className="flex flex-col items-center gap-2.5">
                              <div className={`w-8 h-8 border flex items-center justify-center transition-all duration-500 ${
                                active ? "bg-[var(--ink)] border-[var(--ink)] text-white" : "bg-white border-[var(--border-md)] text-[var(--ink-20)]"
                              }`}>
                                <StepIcon size={14} />
                              </div>
                              <p className={`text-[9px] font-semibold uppercase tracking-widest ${active ? "text-[var(--ink)]" : "text-[var(--ink-30)]"}`}>
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 pt-8 border-t border-[var(--border)]">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-[var(--cream)] border border-[var(--border)] p-4">
                          <div className="w-14 h-18 shrink-0 overflow-hidden bg-[#EEECEA]">
                            <img src={item.image1} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-[var(--ink)] truncate mb-0.5">{item.name}</p>
                            <p className="text-[10px] text-[var(--ink-40)] uppercase tracking-widest mb-1.5">Size {item.size} · Qty {item.quantity}</p>
                            <p className="text-[12px] font-medium text-[var(--ink)] tabular-nums">{currency}{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Address + payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-[var(--border)]">
                      <div className="flex gap-3">
                        <FiMapPin size={14} className="text-[var(--ink-40)] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">Shipping to</p>
                          <p className="text-[12px] font-light text-[var(--ink-60)] leading-relaxed">
                            <span className="font-medium text-[var(--ink)]">{order.address?.firstName} {order.address?.lastName}</span><br />
                            {order.address?.street}, {order.address?.city}<br />
                            {order.address?.state} {order.address?.pincode}, {order.address?.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <FiCreditCard size={14} className="text-[var(--ink-40)] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">Payment</p>
                          <p className="text-[12px] font-medium text-[var(--ink)] uppercase tracking-widest">{order.paymentMethod}</p>
                          <p className="text-[10px] text-[var(--ink-30)] uppercase tracking-widest mt-0.5">Secured transaction</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <OurPolicy />
    </div>
  );
}
