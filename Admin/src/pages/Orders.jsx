import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FiRefreshCw,
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
  FiHash,
  FiShoppingBag,
  FiAlertCircle,
} from "react-icons/fi";
import { authDataContext } from "../context/AuthContext";

export default function Orders() {
  const { serverUrl } = useContext(authDataContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      if (res.data && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
        setError("");
      } else {
        setOrders([]);
        setError("Failed to fetch orders");
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

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/status`,
        { orderId, status },
        { withCredentials: true }
      );

      console.log("Update Status Response:", res.data);

      if (res.data?.success || res.data?.message) {
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

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const getCustomerName = (address) => {
    if (!address) return "Unknown Customer";
    const fullName = `${address.firstName || ""} ${address.lastName || ""}`.trim();
    return fullName || "Unknown Customer";
  };

  const getFullAddress = (address) => {
    if (!address) return "Address not provided";

    const parts = [
      address.street,
      address.city,
      address.state,
      address.pincode,
      address.country,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "Address not provided";
  };

  const getStatusBadge = (status) => {
    const current = status || "Order Placed";

    if (current === "Delivered") {
      return "bg-green-100 text-green-700";
    }
    if (current === "Out for delivery") {
      return "bg-blue-100 text-blue-700";
    }
    if (current === "Shipped") {
      return "bg-purple-100 text-purple-700";
    }
    if (current === "Packing") {
      return "bg-yellow-100 text-yellow-800";
    }
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-black/5 bg-white px-8 py-6 text-gray-500">
          Loading orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 sm:px-8 py-6 max-w-lg w-full">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-red-600 text-xl" />
          </div>
          <p className="text-red-700 text-sm sm:text-base font-medium">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-5 px-5 py-3 bg-black text-white rounded-2xl text-sm hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f7f7f3]">
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 lg:py-10">
        {/* HEADER */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gray-500 mb-2">
                Order Management
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.03em] uppercase">
                All Orders
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl">
                Monitor customer orders, payment status, delivery progress, and
                fulfillment updates from a clean premium dashboard.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-black bg-black text-white px-5 sm:px-6 py-3 text-xs sm:text-sm tracking-[0.18em] uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              <FiRefreshCw />
              Refresh Orders
            </button>
          </div>
        </section>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-black/5 bg-white p-10 sm:p-14 text-center text-gray-500">
            No orders found.
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
                  className="rounded-3xl border border-black/5 bg-white p-4 sm:p-5 lg:p-6 xl:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
                >
                  <div className="grid grid-cols-1 2xl:grid-cols-[1.4fr_0.9fr] gap-6 lg:gap-8">
                    {/* LEFT */}
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#f7f7f3] border border-black/5 flex items-center justify-center">
                            <FiShoppingBag className="text-lg" />
                          </div>
                          <div>
                            <p className="text-xs tracking-[0.28em] uppercase text-gray-500">
                              Order Details
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {products.length} item(s) in this order
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status || "Order Placed"}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {products.length > 0 ? (
                          products.map((item, index) => (
                            <div
                              key={index}
                              className="rounded-3xl border border-black/5 bg-[#fafaf8] p-4"
                            >
                              <p className="text-sm sm:text-base font-medium text-black break-words">
                                {item.name || "Product"}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
                                <span className="rounded-full bg-white border border-black/5 px-3 py-1 text-xs sm:text-sm">
                                  Qty: {item.quantity || 1}
                                </span>
                                {item.size && (
                                  <span className="rounded-full bg-white border border-black/5 px-3 py-1 text-xs sm:text-sm">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.price && (
                                  <span className="rounded-full bg-white border border-black/5 px-3 py-1 text-xs sm:text-sm">
                                    ₹{item.price}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No items found</p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-5">
                      {/* ORDER SUMMARY */}
                      <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5 sm:p-6">
                        <p className="text-xs tracking-[0.28em] uppercase text-gray-500 mb-5">
                          Order Summary
                        </p>

                        <div className="space-y-4 text-sm sm:text-base">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-gray-500 inline-flex items-center gap-2">
                              <FiHash />
                              Order ID
                            </span>
                            <span className="font-medium text-right break-all max-w-[65%]">
                              {order._id}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-gray-500 inline-flex items-center gap-2">
                              <FiPackage />
                              Items
                            </span>
                            <span className="font-medium">{products.length}</span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-gray-500 inline-flex items-center gap-2">
                              <FiCreditCard />
                              Amount
                            </span>
                            <span className="font-medium">₹{order.amount || 0}</span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Payment Method</span>
                            <span className="font-medium text-right">
                              {order.paymentMethod || "COD"}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Payment</span>
                            <span
                              className={`font-medium ${
                                order.paid ? "text-green-600" : "text-yellow-700"
                              }`}
                            >
                              {order.paid ? "Paid" : "Pending"}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-gray-500 inline-flex items-center gap-2">
                              <FiCalendar />
                              Date
                            </span>
                            <span className="font-medium">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6">
                          <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
                            Update Status
                          </label>
                          <select
                            value={order.status || "Order Placed"}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm sm:text-base outline-none focus:border-black"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Packing">Packing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      {/* CUSTOMER INFO */}
                      <div className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6">
                        <p className="text-xs tracking-[0.28em] uppercase text-gray-500 mb-5">
                          Customer Info
                        </p>

                        <div className="space-y-4 text-sm sm:text-base">
                          <div>
                            <p className="text-gray-500 inline-flex items-center gap-2 mb-1">
                              <FiUser />
                              Customer Name
                            </p>
                            <p className="font-medium break-words">{customerName}</p>
                          </div>

                          <div>
                            <p className="text-gray-500 mb-1">Phone</p>
                            <p className="font-medium break-words">
                              {address.phone || "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 inline-flex items-center gap-2 mb-1">
                              <FiMapPin />
                              Address
                            </p>
                            <p className="font-medium break-words">{fullAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
