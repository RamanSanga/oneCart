import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  /* ================= SERVER URL RESOLVE ================= */
  let serverUrl = "http://localhost:8000";
  try {
    if (typeof process !== "undefined" && process.env?.REACT_APP_SERVER_URL) {
      serverUrl = process.env.REACT_APP_SERVER_URL;
    } else if (typeof import.meta !== "undefined" && import.meta.env?.VITE_SERVER_URL) {
      serverUrl = import.meta.env.VITE_SERVER_URL;
    } else if (typeof window !== "undefined" && window.__env?.SERVER_URL) {
      serverUrl = window.__env.SERVER_URL;
    }
  } catch (e) {}

  /* ================= STATE ================= */
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH ALL ORDERS ================= */
  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post(
          `${serverUrl}/api/order/list`,
          {},
          { withCredentials: true }
        );
        if (!mounted) return;
        setOrders(res.data?.orders || []);
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setError("Failed to fetch orders");
        setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, [serverUrl]);

  /* ================= UPDATE ORDER STATUS ================= */
  const updateOrderStatus = async (orderId, status) => {
  try {
    await axios.post(
      `${serverUrl}/api/order/status`,
      { orderId, status },
      { withCredentials: true }
    );

    // update UI instantly
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, status } : o
      )
    );
  } catch (err) {
    console.error("Update status error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to update order status");
  }
};


  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <section className="bg-white min-h-screen px-10 py-20">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <h1 className="text-2xl font-light tracking-wide mb-14">
          All Orders
        </h1>

        {/* HEADER */}
        <div className="grid grid-cols-12 text-xs tracking-widest text-gray-400 border-b pb-4 mb-6">
          <div className="col-span-5">ORDER DETAILS</div>
          <div className="col-span-3">CUSTOMER</div>
          <div className="col-span-4 text-right">SUMMARY</div>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-10">
          {orders.map((order) => {
            const products =
              order.items?.map(
                (it) => `${it.name} * ${it.quantity} ${it.size || ""}`
              ) || [];

            const address = order.address || {};
            const customerName =
              `${address.firstName || ""} ${address.lastName || ""}`.trim() ||
              "Unknown";

            return (
              <div
                key={order._id}
                className="grid grid-cols-12 border-b pb-10 text-sm"
              >
                {/* ORDER DETAILS */}
                <div className="col-span-5 space-y-2">
                  {products.map((p, i) => (
                    <p key={i} className="text-gray-800">
                      {p}
                    </p>
                  ))}
                </div>

                {/* CUSTOMER */}
                <div className="col-span-3 text-gray-700 leading-relaxed">
                  <p className="font-medium">{customerName}</p>
                  <p className="text-gray-500">
                    {address.street ? (
                      <>
                        {address.street}<br />
                        {address.city}, {address.state}<br />
                        {address.pincode}, {address.country}
                      </>
                    ) : (
                      "Address not provided"
                    )}
                  </p>
                  {address.phone && (
                    <p className="text-gray-500">{address.phone}</p>
                  )}
                </div>

                {/* SUMMARY */}
                <div className="col-span-4 text-right space-y-2">
                  <p>
                    <span className="text-gray-400">Items:</span>{" "}
                    {order.items?.length || 0}
                  </p>
                  <p>
                    <span className="text-gray-400">Method:</span>{" "}
                    {order.paymentMethod || "COD"}
                  </p>
                  <p>
                    <span className="text-gray-400">Payment:</span>{" "}
                    {order.paid ? "Paid" : "Pending"}
                  </p>
                  <p>
                    <span className="text-gray-400">Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* STATUS DROPDOWN */}
                  <div className="flex justify-end items-center gap-2">
                    <span className="text-gray-400">Status:</span>
                    <select
                      value={order.status || "Order Placed"}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="border border-gray-300 px-3 py-1 text-sm rounded focus:outline-none"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for delivery">
                        Out for delivery
                      </option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
