import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../Context/AuthContext";
import { shopDataContext } from "../Context/ShopContext";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard } from "react-icons/fi";

function Order() {
  const { serverUrl } = useContext(authDataContext);
  const { currency } = useContext(shopDataContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USER ORDERS ================= */
  useEffect(() => {
    if (!serverUrl) return;
    let mounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/user`,
          { withCredentials: true }
        );

        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.orders || [];

        if (mounted) setOrders(list);
      } catch (err) {
        console.error("fetchOrders error:", err?.response?.data || err.message);
        if (mounted) setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, [serverUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Retrieving your history</p>
      </div>
    );
  }

  const getStatusIndex = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return 3;
    if (s === "shipped") return 2;
    if (s === "processing" || !s) return 1;
    return 0;
  };

  return (
    <section className="pt-[120px] pb-32 bg-[#faf9f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        <div className="flex flex-col md:flex-row items-center gap-4 mb-16">
           <div className="h-px w-12 bg-black hidden md:block" />
           <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-950">Purchase <span className="italic">History</span></h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)] py-32 flex flex-col items-center text-center px-6">
            <div className="w-24 h-24 rounded-full bg-[#faf9f5] flex items-center justify-center mb-8 shadow-inner">
              <FiPackage size={32} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-light text-gray-950 mb-4 tracking-tight">No orders yet</h2>
            <p className="text-gray-500 mb-10 max-w-sm leading-relaxed">
              When you place an order, it will appear here for tracking and reference.
            </p>
            <button 
              onClick={() => navigate("/collection")}
              className="bg-black text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition shadow-xl"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => {
              const statusIdx = getStatusIndex(order.status);
              const isFirstOrder = order.discountPercent > 0;

              return (
                <div key={order._id} className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)] overflow-hidden">
                  
                  {/* ORDER HEADER */}
                  <div className="px-8 py-8 md:px-12 md:py-10 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-8 bg-gray-50/50">
                    <div className="flex flex-wrap gap-10">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Order ID</p>
                        <p className="text-sm font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Date Placed</p>
                        <p className="text-sm font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Amount</p>
                        <p className="text-sm font-semibold text-gray-950">{currency}{order.amount.toFixed(2)}</p>
                      </div>
                    </div>
                    {isFirstOrder && (
                      <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 self-start md:self-center shadow-lg shadow-emerald-500/20">
                        <span className="text-sm">%</span> First Order Offer
                      </div>
                    )}
                  </div>

                  {/* TRACKING PROGRESS */}
                  <div className="px-8 md:px-12 py-12">
                    <div className="max-w-3xl mx-auto relative mb-12">
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-10"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 -z-10 transition-all duration-1000"
                        style={{ width: statusIdx === 3 ? "100%" : statusIdx === 2 ? "66%" : statusIdx === 1 ? "33%" : "0%" }}
                      ></div>
                      
                      <div className="flex justify-between relative">
                        {[
                          { label: "Placed", icon: <FiClock />, active: statusIdx >= 0 },
                          { label: "Processing", icon: <FiPackage />, active: statusIdx >= 1 },
                          { label: "Shipped", icon: <FiTruck />, active: statusIdx >= 2 },
                          { label: "Delivered", icon: <FiCheckCircle />, active: statusIdx >= 3 }
                        ].map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step.active ? "bg-black text-white shadow-lg scale-110" : "bg-white text-gray-300 border-2 border-gray-100"}`}>
                              {step.icon}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${step.active ? "text-black" : "text-gray-300"}`}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ITEMS LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 border-t border-gray-50">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-5 p-4 rounded-3xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all">
                          <img src={item.image1} alt="" className="w-20 h-24 object-cover rounded-2xl shadow-sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-950 truncate mb-1">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium mb-3 uppercase tracking-widest">Size {item.size} • Qty {item.quantity}</p>
                            <p className="text-sm font-semibold text-gray-950">{currency}{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* FOOTER DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-12 border-t border-gray-50">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <FiMapPin />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Shipping to</p>
                          <p className="text-xs leading-relaxed text-gray-600">
                            <span className="font-bold text-gray-900">{order.address?.firstName} {order.address?.lastName}</span><br />
                            {order.address?.street}, {order.address?.city}<br />
                            {order.address?.state} {order.address?.pincode}, {order.address?.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <FiCreditCard />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Payment Method</p>
                          <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{order.paymentMethod}</p>
                          <p className="text-[10px] text-emerald-600 font-medium mt-1 uppercase tracking-widest">Transaction Secure</p>
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
    </section>
  );
}

export default Order;
