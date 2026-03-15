import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${serverUrl}/api/admin/stats`, {
        withCredentials: true,
      });

      console.log("Dashboard stats response:", res.data);

      if (res.data?.success === false) {
        setError(res.data?.message || "Failed to load dashboard stats");
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
        });
      } else {
        setStats({
          totalProducts:
            res.data?.totalProducts ??
            res.data?.stats?.totalProducts ??
            res.data?.products ??
            0,
          totalOrders:
            res.data?.totalOrders ??
            res.data?.stats?.totalOrders ??
            res.data?.orders ??
            0,
          totalRevenue:
            res.data?.totalRevenue ??
            res.data?.stats?.totalRevenue ??
            res.data?.revenue ??
            0,
        });
      }
    } catch (error) {
      console.error("Dashboard stats error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load dashboard stats");
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serverUrl) {
      fetchStats();
    }
  }, [serverUrl]);

  const statCards = [
    {
      title: "TOTAL PRODUCTS",
      value: loading ? "--" : stats.totalProducts,
      action: () => navigate("/list"),
      clickable: true,
    },
    {
      title: "TOTAL ORDERS",
      value: loading ? "--" : stats.totalOrders,
      action: () => navigate("/orders"),
      clickable: true,
    },
    {
      title: "REVENUE",
      value: loading ? "--" : `₹ ${Number(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
      clickable: false,
    },
  ];

  return (
    <div className="w-full bg-[#f8f8f6] text-black">
      <main className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-5 sm:py-6 md:py-8">
        {/* PAGE HEADER */}
        <section className="mb-8 sm:mb-10 md:mb-12">
          <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] text-gray-500 uppercase mb-3">
            One Cart Admin
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.08em] sm:tracking-[0.12em] uppercase">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-2">
                Premium control panel for products, orders and revenue
              </p>
            </div>

            <button
              onClick={fetchStats}
              className="w-full sm:w-auto border border-black px-5 py-2.5 text-sm tracking-[0.18em] uppercase hover:bg-black hover:text-white transition duration-300"
            >
              Refresh
            </button>
          </div>
        </section>

        {/* HERO SECTION - keep old premium tone */}
        <section className="mb-8 sm:mb-10 md:mb-14">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f7f7f5] to-[#efefeb]" />
            <div className="relative px-5 sm:px-8 md:px-10 lg:px-14 py-8 sm:py-10 md:py-12 lg:py-16">
              <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] uppercase text-gray-500 mb-3 sm:mb-4">
                Admin Panel
              </p>

              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-[0.02em]">
                  Welcome back,
                  <span className="block mt-1 sm:mt-2 font-normal">
                    Manage One Cart with elegance.
                  </span>
                </h2>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  Track inventory, monitor orders, and review revenue with a clean,
                  premium dashboard inspired by modern fashion brands.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <section className="mb-8">
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-2xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm sm:text-base">{error}</p>
              <button
                onClick={fetchStats}
                className="w-full sm:w-auto border border-red-300 px-4 py-2 rounded-lg text-sm hover:bg-red-100 transition"
              >
                Retry
              </button>
            </div>
          </section>
        )}

        {/* STATS */}
        <section className="mb-10 sm:mb-12 md:mb-16">
          <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] uppercase text-gray-500 mb-5 sm:mb-6">
            Overview
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {statCards.map((card, index) => (
              <div
                key={index}
                onClick={card.clickable ? card.action : undefined}
                className={`group bg-white border border-black/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition duration-300 ${
                  card.clickable
                    ? "cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                    : ""
                }`}
              >
                <p className="text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-gray-500 mb-4 sm:mb-5">
                  {card.title}
                </p>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-black break-words">
                  {card.value}
                </h3>

                {card.clickable && (
                  <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-gray-500 group-hover:text-black transition">
                    Click to manage →
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="pb-8 sm:pb-10 md:pb-14">
          <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] uppercase text-gray-500 mb-5 sm:mb-6">
            Quick Actions
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div
              onClick={() => navigate("/add")}
              className="group bg-white border border-black/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition duration-300 cursor-pointer"
            >
              <p className="text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-gray-500 mb-3">
                Create
              </p>

              <h4 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 sm:mb-3">
                Add New Product
              </h4>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Upload new products with images, categories, pricing and size options.
              </p>

              <p className="mt-4 text-sm text-black/80 group-hover:translate-x-1 transition">
                Open product form →
              </p>
            </div>

            <div
              onClick={() => navigate("/list")}
              className="group bg-white border border-black/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition duration-300 cursor-pointer"
            >
              <p className="text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-gray-500 mb-3">
                Manage
              </p>

              <h4 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 sm:mb-3">
                View Product List
              </h4>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Review, edit or remove products from your One Cart inventory.
              </p>

              <p className="mt-4 text-sm text-black/80 group-hover:translate-x-1 transition">
                Open product list →
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
