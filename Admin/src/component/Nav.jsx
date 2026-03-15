import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext.jsx";

export default function Nav({ onMenuClick }) {
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);

  const logout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(result.data);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-2xl">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="h-[72px] sm:h-[80px] flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={onMenuClick}
              className="md:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-black/10 bg-white hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center shrink-0"
              aria-label="Open Menu"
            >
              <FiMenu className="text-lg sm:text-xl" />
            </button>

            <div
              className="cursor-pointer min-w-0"
              onClick={() => navigate("/")}
            >
              <p className="text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-gray-500 leading-none mb-1">
                One Cart
              </p>
              <h1 className="text-lg sm:text-2xl lg:text-[28px] font-light tracking-tight text-black leading-none truncate">
                Admin Studio
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center px-4 py-2 rounded-2xl border border-black/5 bg-[#fafaf8]">
              <span className="text-xs uppercase tracking-[0.22em] text-gray-500">
                Control Panel
              </span>
            </div>

            <button
              onClick={logout}
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl border border-black/10 bg-white px-3 sm:px-4 lg:px-5 h-10 sm:h-11 text-sm text-gray-700 hover:bg-black hover:text-white transition-all duration-300"
              aria-label="Admin Logout"
            >
              <FiLogOut className="text-base sm:text-lg" />
              <span className="hidden sm:inline text-sm tracking-wide">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
