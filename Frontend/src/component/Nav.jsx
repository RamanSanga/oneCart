import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiX,
  FiMenu,
  FiHeart,   // ✅ ADD
} from "react-icons/fi";
import axios from "axios";

import { userDataContext } from "../Context/UserContext";
import { authDataContext } from "../Context/AuthContext";
import { shopDataContext } from "../Context/ShopContext";

export default function Navbar() {
  const { showSearch, setShowSearch, search, setSearch, getCartCount } =
    useContext(shopDataContext);
  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // ✅ WISHLIST COUNT
  const [wishlistCount, setWishlistCount] = useState(0);

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();

  const menuItems = [
    { label: "HOME", path: "/" },
    { label: "COLLECTIONS", path: "/collection" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact" },
  ];

  // ================= WISHLIST COUNT =================
  useEffect(() => {
    const updateWishlistCount = () => {
      const ids = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(ids.length);
    };

    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
    };
  }, []);

  /* AUTO FOCUS SEARCH */
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  /* ESC CLOSE SEARCH */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearch("");
      }
    };
    if (showSearch) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showSearch, setSearch]);

  /* CLOSE PROFILE MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* LOGOUT */
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      setShowMenu(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const getInitial = () =>
    userData?.name ? userData.name.charAt(0).toUpperCase() : "";

  return (
    <nav className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-10 py-5">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setShowMobileNav(true)}>
            <FiMenu size={22} />
          </button>

          <h1
            className="text-2xl md:text-3xl font-light cursor-pointer"
            onClick={() => navigate("/")}
          >
            OneCart
          </h1>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-12 text-sm text-gray-700">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.path} className="relative group">
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-black group-hover:w-full transition-all" />
            </Link>
          ))}
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-6 text-xl">
          {/* SEARCH */}
          <button
            onClick={() => {
              if (showSearch) {
                setShowSearch(false);
                setSearch("");
              } else {
                setShowSearch(true);
                setSearch("");
                navigate("/collection");
              }
            }}
          >
            <FiSearch />
          </button>

          {/* ❤️ WISHLIST (NEW) */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <FiHeart />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-[10px] px-[6px] rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative" ref={menuRef}>
            {userData ? (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 rounded-full bg-black text-white text-sm flex items-center justify-center"
              >
                {getInitial()}
              </button>
            ) : (
              <FiUser
                className="cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              />
            )}

            {showMenu && (
              <div className="absolute right-0 mt-4 w-48 bg-white border shadow-lg text-sm">
                {userData ? (
                  <>
                    <div className="px-4 py-2 font-medium">
                      {userData.name}
                    </div>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                      Orders
                    </Link>
                    <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">
                      Account
                    </Link>
                    <button
  data-logout-btn
  onClick={handleLogout}
  className="w-full text-left px-4 py-2 hover:bg-gray-100"
>
  Logout
</button>

                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                      Login
                    </Link>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 🛒 CART */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingBag />
            <span className="absolute -top-2 -right-3 bg-black text-white text-[10px] px-[6px] rounded-full">
              {getCartCount()}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      {showSearch && (
        <div className="w-full border-t bg-white px-4 py-4 flex justify-center">
          <div className="relative w-full md:w-1/2">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for products..."
              className="w-full px-5 pr-12 py-3 bg-gray-50 border rounded-md outline-none focus:border-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MOBILE NAV DRAWER (unchanged) */}
      {showMobileNav && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileNav(false)}
          />
          <div className="absolute left-0 top-0 h-screen w-[80%] bg-white flex flex-col">
            <div className="h-[64px] flex items-center px-6 border-b">
              <button onClick={() => setShowMobileNav(false)}>
                <FiX size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 px-6 py-8 text-[15px]">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setShowMobileNav(false)}
                  className="tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
