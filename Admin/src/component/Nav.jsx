import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import { adminDataContext } from "../context/AdminContext.jsx";

export default function Nav({ onMenuClick }) {
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { getAdmin } = useContext(adminDataContext);

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
    <nav className="w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 fixed top-0 left-0 z-50 shadow-sm">
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
            aria-label="Open Menu"
          >
            <FiMenu className="text-xl" />
          </button>

          {/* LOGO */}
          <h1
            className="text-2xl sm:text-3xl tracking-tight font-light text-black cursor-pointer"
            onClick={() => navigate("/")}
          >
            OneCart <span className="text-xs sm:text-sm text-gray-500 ml-1">Admin</span>
          </h1>
        </div>

        {/* LOGOUT */}
        <button
          className="flex items-center gap-2 text-sm sm:text-[15px] text-gray-700 font-light hover:text-black transition"
          aria-label="Admin Logout"
          onClick={logout}
        >
          <FiLogOut className="text-lg sm:text-xl" />
          <span className="hidden xs:inline">Logout</span>
          <span className="sm:inline hidden">Logout</span>
        </button>
      </div>
    </nav>
  );
}
