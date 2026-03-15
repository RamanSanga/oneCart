import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

export default function Orders() {
  const { serverUrl } = useContext(authDataContext);

  /* ================= STATE ================= */
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${serverUrl}/api/order/list`,
        {},
        { withCredentials: true }
      );

      console.log("Orders API Response:", res.data);

      if (res.data?.success) {
        setOrders(res.data?.orders || []);
      } else {
        setOrders([]);
        setError(res.data?.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err.response?.data || err.message);
      setOrders([]);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serverUrl) {
      fetchOrders();
    }
  }, [serverUrl]);

  /* ================= UPDATE STATUS ================= */
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/status`,
        { orderId, status },
        { withCredentials: true }
      );

      console.log("Update Status Response:", res.data);

      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else {
        alert(res.data?.message || "Failed to update order status");
      }
    } catch (err) {
      console.error("Update Status Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  /* ================= HELPERS ================= */
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const getCustomerName = (address) => {
    if (!address) return "Unknown Customer";
    const fullName = `${address.firstName || ""} ${address.lastName || ""}`.trim();
    return fullName || "Unknown Customer";
  };

  const getFullAddress = (address) => {
    if (!address || !address.street) return "Address not provided";

    return `${address.street}, ${address.city || ""}, ${address.state || ""}, ${
      address.pincode || ""
    }, ${address.country || ""}`;
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-sm sm:text-base">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-red-600 text-sm sm:text-base font-medium">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md text-sm hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white px-3 sm:px-5 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            All Orders
          </h1>

          <button
            onClick={fetchOrders}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition"
          >
            Refresh Orders
          </button>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="border border-gray-200 rounded-xl p-8 text-center bg-gray-50">
            <p className="text-gray-500 text-sm sm:text-base">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {orders.map((order) => {
              const address = order.address || {};
              const customerName = getCustomerName(address);
              const fullAddress = getFullAddress(address);
              const products = order.items || [];

              return (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm bg-white"
                >
                  {/* TOP SECTION */}
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                    {/* LEFT: ORDER DETAILS */}
                    <div className="flex-1">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        Order Details
                      </h2>

                      <div className="space-y-3">
                        {products.length > 0 ? (
                          products.map((item, index) => (
                            <div
                              key={index}
                              className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                            >
                              <p className="text-sm sm:text-base font-medium text-gray-800">
                                {item.name || "Product"}
                              </p>

                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
                                <span>Qty: {item.quantity || 1}</span>
                                {item.size && <span>Size: {item.size}</span>}
                                {item.price && <span>₹{item.price}</span>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No items found</p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="w-full lg:max-w-sm">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        Order Summary
                      </h2>

                      <div className="space-y-2 text-sm sm:text-base">
                        <div className="flex justify-between gap-3">
                          <span className="text-gray-500">Order ID:</span>
                          <span className="text-gray-800 font-medium break-all text-right">
                            {order._id}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-gray-500">Items:</span>
                          <span className="text-gray-800 font-medium">
                            {products.length}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-gray-500">Amount:</span>
                          <span className="text-gray-800 font-medium">
                            ₹{order.amount || 0}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-gray-500">Payment Method:</span>
                          <span className="text-gray-800 font-medium">
                            {order.paymentMethod || "COD"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-gray-500">Payment:</span>
                          <span
                            className={`font-medium ${
                              order.paid ? "text-green-600" : "text-yellow-600"
                            }`}
                          >
                            {order.paid ? "Paid" : "Pending"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-gray-500">Date:</span>
                          <span className="text-gray-800 font-medium">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>

                        {/* STATUS */}
                        <div className="pt-3">
                          <label className="block text-gray-500 text-sm mb-2">
                            Update Status
                          </label>
                          <select
                            value={order.status || "Order Placed"}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black"
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
                  </div>

                  {/* CUSTOMER SECTION */}
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                      Customer Info
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
                      <div>
                        <p className="text-gray-500">Customer Name</p>
                        <p className="text-gray-800 font-medium">{customerName}</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="text-gray-800 font-medium">
                          {address.phone || "Not provided"}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-gray-500">Address</p>
                        <p className="text-gray-800 font-medium break-words">
                          {fullAddress}
                        </p>
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
