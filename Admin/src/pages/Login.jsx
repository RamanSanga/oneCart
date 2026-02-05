import { useContext, useState } from "react";
import googleIcon from "../assets/google.png";
import oneCart from "../assets/oneCart.png";
import openEye from "../assets/openEye.png";
import closeEye from "../assets/closeEye.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { getAdmin } = useContext(adminDataContext);
  const { serverUrl } = useContext(authDataContext);   // ✅ correct source
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const AdminLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/adminlogin`,   // ✅ correct endpoint
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,              // ✅ must stay true
        }
      );

      console.log("Login success:", result.data);

      await getAdmin();   // wait for admin data
      navigate("/");      // go to dashboard

    } catch (error) {
      console.error(
        "Login failed:",
        error?.response?.status,
        error?.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#021a24] to-[#051f2d] flex items-center justify-center p-6">
      <div className="hidden md:flex flex-col w-1/2 text-white px-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={oneCart} className="w-10 h-10 bg-white/20 rounded-full" />
          <h1 className="text-2xl font-semibold">OneCart</h1>
        </div>
        <h2 className="text-4xl font-bold leading-snug"> Admin Page</h2>
        <p className="text-gray-300 mt-3 text-lg">Let's add something </p>
      </div>

      <div className="bg-[#0b2a36]/60 backdrop-blur-xl shadow-2xl border border-white/10 rounded-2xl p-10 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Page</h2>

        <form onSubmit={AdminLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-transparent border border-white/20 rounded-lg p-3 outline-none text-white"
            placeholder="Email"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/20 rounded-lg p-3 pr-12 outline-none text-white"
              placeholder="Password"
              required
            />

            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <img src={openEye} className="w-6 h-6 filter invert" />
              ) : (
                <img src={closeEye} className="w-6 h-6 filter invert" />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition p-3 rounded-lg text-lg font-semibold mt-4"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
}
