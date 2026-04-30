import { useContext, useState } from "react";
import googleIcon from "../assets/google.png";
import oneCart from "../assets/oneCart.png";
import openEye from "../assets/openEye.png";
import closeEye from "../assets/closeEye.png";
import back7 from "../assets/back7.png";
import { Link, useNavigate } from "react-router-dom";
import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        serverUrl + "/api/auth/login",
        { email: form.email, password: form.password },
        { withCredentials: true }
      );
      await getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await axios.post(
        serverUrl + "/api/auth/googlelogin",
        { name: user.displayName, email: user.email },
        { withCredentials: true }
      );
      await getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      alert(error.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
      {/* LEFT COMPONENT - IMAGE */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={back7} 
            alt="Luxury Fashion" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </motion.div>
        
        <div className="absolute bottom-12 left-12 text-white max-w-md">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-3xl font-light tracking-wide mb-3">Elevate your style.</h2>
            <p className="text-white/80 font-light leading-relaxed">
              Curated collections from the world's most exclusive designers, delivered directly to your door.
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT COMPONENT - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative">
        {/* Subtle decorative background blur */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md z-10"
        >
          {/* Logo */}
          <Link to="/" className="inline-block mb-12 group">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-xl">
              <span className="text-white font-bold text-xl tracking-tighter">OC</span>
            </div>
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-3">Welcome Back</h1>
            <p className="text-gray-500 text-sm tracking-wide">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-200 py-3 text-base text-black placeholder-gray-300 outline-none focus:border-black transition-all"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-1 group relative">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">
                  Password
                </label>
                <Link to="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-200 py-3 pr-10 text-base text-black placeholder-gray-300 outline-none focus:border-black transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-0 bottom-3 text-gray-400 hover:text-black transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? openEye : closeEye}
                  alt="Toggle password"
                  className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity"
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 mt-8 rounded-none text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Or continue with</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={googleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-black py-4 rounded-none text-xs font-bold uppercase tracking-[0.1em] hover:border-black hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
          >
            <img src={googleIcon} className="w-4 h-4" alt="Google" />
            {googleLoading ? "Connecting..." : "Google"}
          </button>

          <p className="mt-12 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-black border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors">
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
