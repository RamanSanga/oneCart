import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBox,
  FiShoppingBag,
  FiRefreshCw,
  FiTrendingUp,
  FiPlus,
  FiList,
  FiAlertCircle,
} from "react-icons/fi";
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

  const statCards = useMemo(
    () => [
      {
        title: "Total Products",
        value: loading ? "--" : stats.totalProducts,
        icon: FiBox,
        subtitle: "Inventory items available in catalog",
        action: () => navigate("/list"),
        clickable: true,
      },
      {
        title: "Total Orders",
        value: loading ? "--" : stats.totalOrders,
        icon: FiShoppingBag,
        subtitle: "Orders placed across the platform",
        action: () => navigate("/orders"),
        clickable: true,
      },
      {
        title: "Revenue",
        value: loading
          ? "--"
          : `₹ ${Number(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
        icon: FiTrendingUp,
        subtitle: "Total revenue generated from orders",
        clickable: false,
      },
    ],
    [loading, stats, navigate]
  );

  return (
    <div className="min-h-screen w-full bg-[#f7f7f3] text-black">
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-5 sm:py-6 md:py-8 lg:py-10">
        {/* PAGE HEADER */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] text-gray-500 uppercase mb-2 sm:mb-3">
                One Cart Admin
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-light tracking-[0.03em] uppercase leading-none">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl">
                A refined commerce control center for managing products, orders, and
                store performance with a premium retail-inspired interface.
              </p>
            </div>

            <button
              onClick={fetchStats}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-black bg-black text-white px-5 sm:px-6 py-3 text-xs sm:text-sm tracking-[0.18em] uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              <FiRefreshCw className="text-base" />
              Refresh Data
            </button>
          </div>
        </section>

        {/* HERO */}
        <section className="mb-8 sm:mb-10 md:mb-12 lg:mb-14">
          <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.035),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.025),transparent_30%)]" />
            <div className="relative px-5 sm:px-7 md:px-8 lg:px-10 xl:px-12 py-7 sm:py-8 md:py-10 lg:py-12">
              <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.9fr] gap-8 xl:gap-10 items-start">
                <div>
                  <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] uppercase text-gray-500 mb-3 sm:mb-4">
                    Premium Control Panel
                  </p>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-[0.01em] max-w-3xl">
                    Welcome back.
                    <span className="block font-medium mt-1 sm:mt-2">
                      Manage One Cart with clarity and style.
                    </span>
                  </h2>

                  <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
                    Access a modern admin workspace designed for faster product
                    management, cleaner order handling, and better business visibility
                    across every screen size.
                  </p>

                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate("/add")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-5 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-[0.18em] hover:bg-neutral-800 transition"
                    >
                      <FiPlus />
                      Add Product
                    </button>

                    <button
                      onClick={() => navigate("/orders")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-[0.18em] hover:border-black hover:bg-black hover:text-white transition"
                    >
                      View Orders
                      <FiArrowRight />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
                  <div className="rounded-2xl border border-black/5 bg-[#fafaf8] p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                      Products
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-light">
                      {loading ? "--" : stats.totalProducts}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-[#fafaf8] p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                      Orders
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-light">
                      {loading ? "--" : stats.totalOrders}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-[#fafaf8] p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                      Revenue
                    </p>
                    <h3 className="text-xl sm:text-2xl font-light break-words">
                      {loading
                        ? "--"
                        : `₹ ${Number(stats.totalRevenue || 0).toLocaleString("en-IN")}`}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <section className="mb-8 sm:mb-10">
            <div className="rounded-3xl border border-red-200 bg-red-50/80 px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <FiAlertCircle className="text-red-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-red-700">
                    Unable to load dashboard data
                  </p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>

              <button
                onClick={fetchStats}
                className="w-full md:w-auto rounded-2xl border border-red-300 px-5 py-2.5 text-sm text-red-700 hover:bg-red-100 transition"
              >
                Retry
              </button>
            </div>
          </section>
        )}

        {/* OVERVIEW */}
        <section className="mb-10 sm:mb-12 lg:mb-14">
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] uppercase text-gray-500">
              Overview
            </p>
            <div className="hidden sm:block h-px flex-1 bg-black/5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {statCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={index}
                  onClick={card.clickable ? card.action : undefined}
                  className={`group rounded-3xl border border-black/5 bg-white p-5 sm:p-6 lg:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition-all duration-300 ${
                    card.clickable
                      ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-gray-500">
                        {card.title}
                      </p>
                    </div>

                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#f7f7f3] border border-black/5 flex items-center justify-center">
                      <Icon className="text-lg sm:text-xl text-black" />
                    </div>
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black break-words">
                    {card.value}
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                    {card.subtitle}
                  </p>

                  {card.clickable && (
                    <div className="mt-5 inline-flex items-center gap-2 text-sm text-black/75 group-hover:text-black transition">
                      Open section
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="pb-8 sm:pb-10 lg:pb-14">
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] uppercase text-gray-500">
              Quick Actions
            </p>
            <div className="hidden sm:block h-px flex-1 bg-black/5" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div
              onClick={() => navigate("/add")}
              className="group rounded-3xl border border-black/5 bg-white p-5 sm:p-6 md:p-7 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#f7f7f3] border border-black/5 flex items-center justify-center mb-4">
                <FiPlus className="text-lg" />
              </div>

              <p className="text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-gray-500 mb-3">
                Create
              </p>

              <h4 className="text-xl sm:text-2xl font-medium mb-3">Add New Product</h4>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Upload product images, define pricing, categories, and size options
                in a clean, professional product creation flow.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm text-black/80 group-hover:text-black">
                Open product form
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => navigate("/list")}
              className="group rounded-3xl border border-black/5 bg-white p-5 sm:p-6 md:p-7 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#f7f7f3] border border-black/5 flex items-center justify-center mb-4">
                <FiList className="text-lg" />
              </div>

              <p className="text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-gray-500 mb-3">
                Manage
              </p>

              <h4 className="text-xl sm:text-2xl font-medium mb-3">View Product List</h4>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Review inventory, edit product details, and maintain your catalog with
                a polished management experience.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm text-black/80 group-hover:text-black">
                Open product list
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
