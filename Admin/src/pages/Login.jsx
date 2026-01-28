import { useContext, useState } from "react";
import googleIcon from "../assets/google.png";
import oneCart from "../assets/oneCart.png";
import openEye from "../assets/openEye.png";
import closeEye from "../assets/closeEye.png";
import { Link } from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";



export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const {adminData , getAdmin} = useContext(adminDataContext)
  const {serverUrl} = useContext(authDataContext)
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const AdminLogin = async (e) => {
  e.preventDefault();
  try {
    const result = await axios.post(
      serverUrl + "/api/auth/adminlogin",
      {
        email: form.email,
        password: form.password,
      },
      { withCredentials: true }
    );

    console.log(result.data);
    getAdmin();
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

  
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#021a24] to-[#051f2d] flex items-center justify-center p-6">
      
      {/* Left Section */}
      <div className="hidden md:flex flex-col w-1/2 text-white px-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={oneCart} className="w-10 h-10 bg-white/20 rounded-full" />
          <h1 className="text-2xl font-semibold">OneCart</h1>
        </div>
        <h2 className="text-4xl font-bold leading-snug"> Admin Page</h2>
        <p className="text-gray-300 mt-3 text-lg">Let's add something </p>
      </div>

      {/* Right Section */}
      <div className="bg-[#0b2a36]/60 backdrop-blur-xl shadow-2xl border border-white/10 rounded-2xl p-10 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Page</h2>
        <p className="text-center text-gray-300 mb-6">Access your OneCart account</p>

       
        <div className="flex items-center gap-4 my-4">
          <div className="h-px w-full bg-white/20"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px w-full bg-white/20"></div>
        </div>

        {/* Form */}
        <form onSubmit={AdminLogin } className="space-y-4">

          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/20 rounded-lg p-3 outline-none text-white"
              placeholder="Email"
              required
            />
          </div>

          {/* Password Field */}
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

            {/* Eye Icons */}
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/70 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <img src={openEye} className="w-6 h-6 object-contain filter invert" />
              ) : (
                <img src={closeEye} className="w-6 h-6 object-contain filter invert" />
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

        {/* Create New Account Link */}
        <p className="text-center mt-4 text-sm text-gray-300">
          Don't have an account?{" "}
          <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
            <Link to='/signup'>  Create New Account  </Link>
          </span>
        </p>
      </div>
    </div>
  );
}
