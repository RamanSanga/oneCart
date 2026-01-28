import { useContext, useState, useEffect } from "react";
import googleIcon from "../assets/google.png";
import oneCart from "../assets/oneCart.png";
import openEye from "../assets/openEye.png";
import closeEye from "../assets/closeEye.png";
import { Link, useNavigate } from "react-router-dom";
import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";
import axios from "axios";
import {
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  /* ================= EMAIL LOGIN ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        serverUrl + "/api/auth/login",
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      await getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error?.response?.data || error.message);
    }
  };

  /* ================= GOOGLE LOGIN (STEP 1) ================= */
  const googleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google redirect error:", error);
      setGoogleLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN (STEP 2) ================= */
  useEffect(() => {
    const handleRedirectLogin = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (!result || !result.user) return;

        const user = result.user;
        const name = user.displayName;
        const email = user.email;

        // Send Google user to backend
        await axios.post(
          serverUrl + "/api/auth/googlelogin",
          { name, email },
          { withCredentials: true }
        );

        await getCurrentUser();
        navigate("/");
      } catch (error) {
        console.error(
          "Google login error:",
          error?.response?.data || error.message
        );
      } finally {
        setGoogleLoading(false);
      }
    };

    handleRedirectLogin();
  }, [serverUrl, getCurrentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#021a24] to-[#051f2d] flex items-center justify-center p-6">

      {/* LEFT */}
      <div className="hidden md:flex flex-col w-1/2 text-white px-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={oneCart} className="w-10 h-10 bg-white/20 rounded-full" />
          <h1 className="text-2xl font-semibold">OneCart</h1>
        </div>
        <h2 className="text-4xl font-bold">Welcome Back</h2>
        <p className="text-gray-300 mt-3 text-lg">
          Login to continue shopping
        </p>
      </div>

      {/* RIGHT */}
      <div className="bg-[#0b2a36]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login Page
        </h2>

        {/* GOOGLE */}
        <button
          onClick={googleLogin}
          disabled={googleLoading}
          className="w-full bg-white/10 hover:bg-white/20 transition p-3 rounded-lg flex items-center justify-center gap-3 mb-6 disabled:opacity-60"
        >
          <img src={googleIcon} className="w-5" />
          {googleLoading ? "Redirecting..." : "Login with Google"}
        </button>

        <div className="flex items-center gap-4 my-4">
          <div className="h-px w-full bg-white/20" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px w-full bg-white/20" />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-transparent border border-white/20 rounded-lg p-3"
            placeholder="Email"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/20 rounded-lg p-3 pr-12"
              placeholder="Password"
              required
            />

            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? openEye : closeEye}
                className="w-6 h-6 filter invert"
              />
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 p-3 rounded-lg text-lg font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
}
