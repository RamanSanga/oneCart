import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "../Context/authContext";
import { shopDataContext } from "../Context/shopContext";

function Order() {
  const { serverUrl } = useContext(authDataContext);
  const { currency } = useContext(shopDataContext);

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
      <div className="min-h-screen flex items-center justify-center text-sm tracking-wide">
        Loading your orders...
      </div>
    );
  }

  const statusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <section className="pt-[120px] pb-32 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-light tracking-wide mb-16">
          My Orders
        </h1>

        {/* ================= EMPTY STATE ================= */}
        {orders.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-[180px] h-[220px] bg-gray-100 mb-10 flex items-center justify-center text-gray-400 text-sm">
              No Orders
            </div>

            <h2 className="text-2xl font-light mb-4">
              You haven’t placed any orders yet
            </h2>

            <p className="text-gray-500 text-sm max-w-md">
              Once you place an order, it will appear here for tracking and reference.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {orders.map((order) => {
              const discountApplied =
                order.discountPercent && order.discountPercent > 0;

              return (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-xl p-8 md:p-10 bg-white"
                >
                  {/* ================= ORDER HEADER ================= */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order ID</p>
                      <p className="text-sm tracking-wide font-medium">
                        #{order._id.slice(-8)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs uppercase tracking-wide px-4 py-1 border rounded-full ${statusStyle(order.status)}`}
                      >
                        {order.status || "Processing"}
                      </span>

                      <button
                        className="text-xs uppercase tracking-wide px-5 py-2 border border-black hover:bg-black hover:text-white transition"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>

                  {/* 🎉 DISCOUNT INFO */}
                  <div className="mb-8">
                    {discountApplied ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-300 bg-green-50 text-green-700 text-xs tracking-wide">
                        🎉 {order.discountPercent}% First Order Discount Applied
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-500 text-xs tracking-wide">
                        No Discount Applied
                      </div>
                    )}
                  </div>

                  {/* ================= ITEMS ================= */}
                  <div className="space-y-8">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start gap-6 border-b pb-6"
                      >
                        <div className="flex gap-6">
                          <img
                            src={item.image1}
                            alt={item.name}
                            className="w-[90px] h-[120px] object-cover rounded-md"
                          />

                          <div>
                            <p className="text-sm font-medium mb-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Size {item.size} · Qty {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-medium">
                          {currency}
                          {item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* ================= ORDER FOOTER ================= */}
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
                    {/* ADDRESS */}
                    <div>
                      <p className="uppercase text-xs text-gray-500 mb-2">
                        Delivery Address
                      </p>
                      <p className="leading-relaxed text-gray-700">
                        {order.address.firstName} {order.address.lastName}<br />
                        {order.address.street}<br />
                        {order.address.city}, {order.address.state}<br />
                        {order.address.pincode}, {order.address.country}<br />
                        {order.address.phone}
                      </p>
                    </div>

                    {/* PAYMENT */}
                    <div>
                      <p className="uppercase text-xs text-gray-500 mb-2">
                        Payment
                      </p>
                      <p className="capitalize text-gray-700">
                        {order.paymentMethod}
                      </p>
                    </div>

                    {/* TOTAL */}
                    <div className="md:text-right">
                      <p className="uppercase text-xs text-gray-500 mb-2">
                        Order Total
                      </p>
                      <p className="text-lg font-medium">
                        {currency}{order.amount}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
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
