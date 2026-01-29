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

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  /* ================= NORMAL SIGNUP ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        serverUrl + "/api/auth/registration",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      await getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error?.response?.data || error.message);
    }
  };

  /* ================= GOOGLE SIGNUP (STEP 1) ================= */
const googleSignUp = async () => {
  try {
    setGoogleLoading(true);

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await axios.post(
      serverUrl + "/api/auth/googlelogin",
      {
        name: user.displayName,
        email: user.email,
      },
      { withCredentials: true }
    );

    await getCurrentUser();
    navigate("/");
  } catch (error) {
    console.error("Google signup error:", error);
    alert(error.message || "Google signup failed");
  } finally {
    setGoogleLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-[#021a24] to-[#051f2d] flex items-center justify-center p-6">

      {/* LEFT */}
      <div className="hidden md:flex flex-col w-1/2 text-white px-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={oneCart} className="w-10 h-10 bg-white/20 rounded-full" />
          <h1 className="text-2xl font-semibold">OneCart</h1>
        </div>
        <h2 className="text-4xl font-bold">Welcome to OneCart</h2>
        <p className="text-gray-300 mt-3 text-lg">
          Place your order effortlessly
        </p>
      </div>

      {/* RIGHT */}
      <div className="bg-[#0b2a36]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          Registration Page
        </h2>

        {/* GOOGLE */}
        <button
          onClick={googleSignUp}
          disabled={googleLoading}
          className="w-full bg-white/10 hover:bg-white/20 transition p-3 rounded-lg flex items-center justify-center gap-3 mb-6 disabled:opacity-60"
        >
          <img src={googleIcon} className="w-5" />
          {googleLoading ? "Redirecting..." : "Register with Google"}
        </button>

        <div className="flex items-center gap-4 my-4">
          <div className="h-px w-full bg-white/20" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px w-full bg-white/20" />
        </div>

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-transparent border border-white/20 rounded-lg p-3"
            placeholder="Username"
            required
          />

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
            Create Account
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
