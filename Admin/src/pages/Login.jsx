import { useContext, useState } from "react";
import oneCart from "../assets/oneCart.png";
import openEye from "../assets/openEye.png";
import closeEye from "../assets/closeEye.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getAdmin } = useContext(adminDataContext);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const AdminLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/api/auth/adminlogin`,
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login success:", result.data);

      await getAdmin();
      navigate("/");
    } catch (error) {
      console.error(
        "Login failed:",
        error?.response?.status,
        error?.response?.data || error.message
      );

      alert(error?.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-black">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex relative overflow-hidden border-r border-black/5 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.04),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.03),transparent_30%)]" />

          <div className="relative flex flex-col justify-between w-full px-10 xl:px-14 py-10 xl:py-14">
            {/* TOP */}
            <div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f7f7f3] border border-black/5 flex items-center justify-center overflow-hidden">
                  <img src={oneCart} alt="OneCart" className="w-8 h-8 object-contain" />
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500 mb-1">
                    One Cart
                  </p>
                  <h1 className="text-2xl xl:text-3xl font-light tracking-tight">
                    Admin Studio
                  </h1>
                </div>
              </div>

              <div className="mt-16 xl:mt-20 max-w-xl">
                <p className="text-[10px] tracking-[0.35em] uppercase text-gray-500 mb-4">
                  Premium Commerce Control
                </p>

                <h2 className="text-4xl xl:text-6xl font-light leading-[1.05] tracking-tight">
                  Welcome back.
                  <span className="block font-medium mt-2">
                    Manage One Cart with confidence.
                  </span>
                </h2>

                <p className="mt-6 text-base xl:text-lg text-gray-600 leading-relaxed">
                  A refined admin workspace built for inventory, orders, and store
                  operations — designed with a modern premium retail aesthetic.
                </p>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  System
                </p>
                <p className="text-lg font-medium">Secure</p>
              </div>

              <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Access
                </p>
                <p className="text-lg font-medium">Admin Only</p>
              </div>

              <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Panel
                </p>
                <p className="text-lg font-medium">Premium UI</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
          <div className="w-full max-w-md">
            {/* MOBILE BRAND */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-white border border-black/5 flex items-center justify-center overflow-hidden">
                <img src={oneCart} alt="OneCart" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500 mb-1">
                  One Cart
                </p>
                <h1 className="text-xl font-light tracking-tight">Admin Studio</h1>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
              <div className="mb-8">
                <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gray-500 mb-3">
                  Admin Login
                </p>
                <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
                  Sign in to continue
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mt-3">
                  Access your premium control panel for products, orders, and store
                  management.
                </p>
              </div>

              <form onSubmit={AdminLogin} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="block text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#fafaf8] px-4 sm:px-5 h-14">
                    <FiMail className="text-gray-500 text-lg shrink-0" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm sm:text-base placeholder:text-gray-400"
                      placeholder="admin@onecart.com"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#fafaf8] px-4 sm:px-5 h-14">
                    <FiLock className="text-gray-500 text-lg shrink-0" />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm sm:text-base placeholder:text-gray-400"
                      placeholder="Enter your password"
                      required
                    />

                    <button
                      type="button"
                      className="shrink-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <img
                        src={showPassword ? openEye : closeEye}
                        className="w-5 h-5 opacity-70"
                        alt="toggle password"
                      />
                    </button>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-3 rounded-2xl bg-black text-white h-14 text-sm sm:text-base font-medium tracking-[0.08em] hover:bg-neutral-800 transition disabled:opacity-60"
                >
                  {loading ? "Signing In..." : "Sign In"}
                  {!loading && <FiArrowRight className="text-lg" />}
                </button>
              </form>

              {/* FOOTER NOTE */}
              <div className="mt-6 pt-6 border-t border-black/5">
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  This area is restricted to authorized administrators only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
