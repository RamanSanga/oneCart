import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../component/Nav.jsx";
import Sidebar from "../component/Sidebar.jsx";

function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const serverUrl = "http://localhost:8000";

  /* ================= FETCH DASHBOARD STATS ================= */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/admin/stats`,
          { withCredentials: true }
        );
        setStats(res.data);
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black">
      <Nav />
      <Sidebar />

      <main className="ml-[80px] pt-[100px] px-10 transition-all duration-300">

        {/* PAGE TITLE */}
        <h1 className="text-[22px] tracking-[0.4em] font-light mb-12">
          DASHBOARD
        </h1>

        {/* HERO */}
        <section className="mb-16">
          <div className="w-full h-[260px] rounded-2xl bg-gradient-to-r from-black to-gray-800 text-white flex items-end p-10">
            <div>
              <p className="text-xs tracking-[0.35em] opacity-80 mb-3">
                ADMIN PANEL
              </p>
              <h2 className="text-3xl font-light">
                Welcome back, Admin
              </h2>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">

          {/* PRODUCTS */}
          <div
            onClick={() => navigate("/list")}
            className="bg-white rounded-xl p-8 shadow-sm cursor-pointer hover:shadow-md transition"
          >
            <p className="text-xs tracking-[0.3em] text-gray-500 mb-4">
              TOTAL PRODUCTS
            </p>
            <h3 className="text-4xl font-light">
              {loading ? "--" : stats.totalProducts}
            </h3>
          </div>

          {/* ORDERS */}
          <div
            onClick={() => navigate("/orders")}
            className="bg-white rounded-xl p-8 shadow-sm cursor-pointer hover:shadow-md transition"
          >
            <p className="text-xs tracking-[0.3em] text-gray-500 mb-4">
              TOTAL ORDERS
            </p>
            <h3 className="text-4xl font-light">
              {loading ? "--" : stats.totalOrders}
            </h3>
          </div>

          {/* REVENUE */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <p className="text-xs tracking-[0.3em] text-gray-500 mb-4">
              REVENUE
            </p>
            <h3 className="text-4xl font-light">
              ₹ {loading ? "--" : stats.totalRevenue.toLocaleString("en-IN")}
            </h3>
          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section>
          <p className="text-xs tracking-[0.35em] text-gray-500 mb-8">
            QUICK ACTIONS
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <div
              onClick={() => navigate("/add")}
              className="bg-white rounded-xl p-8 hover:shadow-md transition cursor-pointer"
            >
              <h4 className="text-lg font-medium mb-2">
                Add New Product
              </h4>
              <p className="text-sm text-gray-500">
                Upload new products with images and sizes
              </p>
            </div>

            <div
              onClick={() => navigate("/list")}
              className="bg-white rounded-xl p-8 hover:shadow-md transition cursor-pointer"
            >
              <h4 className="text-lg font-medium mb-2">
                View Product List
              </h4>
              <p className="text-sm text-gray-500">
                Manage, edit or remove existing products
              </p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Home;
