import { useState, useRef, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiX,
  FiMenu,
  FiHeart,
  FiChevronRight,
  FiLogOut,
  FiPackage,
  FiSettings,
} from "react-icons/fi";
import axios from "axios";

import { userDataContext } from "../Context/UserContext";
import { authDataContext } from "../Context/AuthContext";
import { shopDataContext } from "../Context/ShopContext";
import { useToast } from "../Context/ToastContext";

export default function Navbar() {
  const {
    showSearch,
    setShowSearch,
    search,
    setSearch,
    cartCount,
    wishlistCount,
    products,
    currency,
  } = useContext(shopDataContext);

  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const isLoggedIn = Boolean(userData?._id || userData?.name);
  const userInitial = useMemo(
    () => (userData?.name ? userData.name.charAt(0).toUpperCase() : ""),
    [userData?.name]
  );
  const userDisplayName = userData?.name || "Account";

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/collection" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearch("");
      }
    };
    if (showSearch) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showSearch, setSearch, setShowSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowMenu(false);
    setShowMobileNav(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [banner, setBanner] = useState({ text: "", active: false });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/admin/settings/public`); 
        if (response.data.success) {
          const b = response.data.settings.find(s => s.key === "offer_banner");
          if (b) setBanner(b.value);
        }
      } catch (e) { /* ignore */ }
    };
    fetchBanner();
  }, [serverUrl]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      toast.success({
        title: "Signed out",
        message: "We've securely cleared your session.",
        dedupeKey: "auth:logout:success",
      });
      navigate("/");
    } catch (err) {
      toast.error({ title: "Sign out failed", message: "Please try again." });
    }
  };

  const navThemeClass = location.pathname === "/" && !isScrolled ? "nav-transparent" : "nav-scrolled";

  return (
      <nav className={`w-full fixed top-0 left-0 z-40 transition-all duration-300 ${navThemeClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        <div className="flex items-center gap-6">
          <button
            className="md:hidden p-2 -ml-2 text-white"
            onClick={() => setShowMobileNav(true)}
            aria-label="Open menu"
          >
            <FiMenu size={24} />
          </button>

          <h1
            className="text-2xl md:text-3xl font-light tracking-tight cursor-pointer text-white"
            onClick={() => navigate("/")}
          >
            OneCart<span className="text-white font-bold"></span>
          </h1>
        </div>

        <div className="hidden md:flex gap-10 text-[13px] font-medium tracking-widest text-white/90 uppercase">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`relative group transition-colors hover:text-yellow-300 ${
                location.pathname === item.path ? "text-yellow-300" : ""
              }`}
            >
              {item.label}
              <span
                className={`absolute left-0 -bottom-1 h-[1.5px] bg-yellow-300 transition-all duration-300 ${
                  location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5 md:gap-7 text-white">
          <button
            className="p-2 hover:bg-white/8 rounded-full transition-colors"
            onClick={() => {
              if (showSearch) {
                setShowSearch(false);
                setSearch("");
              } else {
                setShowSearch(true);
                navigate("/collection");
              }
            }}
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>

          <div
            className="relative p-2 hover:bg-white/8 rounded-full transition-colors cursor-pointer group"
            onClick={() => navigate("/wishlist")}
          >
            <FiHeart size={20} className="group-hover:fill-yellow-300 transition-all" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-yellow-300 text-black text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-black">
                {wishlistCount}
              </span>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-1 pr-2 hover:bg-white/8 rounded-full transition-all border border-transparent hover:border-white/10"
              aria-label="Account menu"
            >
              {isLoggedIn ? (
                <div className="w-8 h-8 rounded-full bg-white text-black text-xs flex items-center justify-center font-bold shadow-md">
                  {userInitial}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center transition-colors group-hover:bg-white/20">
                  <FiUser size={18} />
                </div>
              )}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                {isLoggedIn ? (
                  <>
                    <div className="px-5 py-4 border-b border-gray-50 mb-2">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="font-semibold text-gray-900 truncate">{userDisplayName}</p>
                    </div>
                    <MenuLink to="/order" icon={<FiPackage size={16} />} label="My Orders" />
                    <MenuLink to="/account" icon={<FiSettings size={16} />} label="Account Settings" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-5 py-4 border-b border-gray-50 mb-2">
                      <p className="text-sm text-gray-500 leading-relaxed">Sign in to sync your cart and access exclusive offers.</p>
                    </div>
                    <MenuLink to="/login" icon={<FiChevronRight size={16} />} label="Sign In" />
                    <MenuLink to="/signup" icon={<FiChevronRight size={16} />} label="Create Account" />
                  </>
                )}
              </div>
            )}
          </div>

          <button
            className="relative p-2 hover:bg-white/8 rounded-full transition-colors group"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
          >
            <FiShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-yellow-300 text-black text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-black animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="w-full border-t border-white/10 bg-black/85 backdrop-blur-xl px-6 py-6 animate-in slide-in-from-top-4 duration-300 relative">
          <div className="max-w-3xl mx-auto relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search our premium collection..."
              className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/10 text-lg font-light text-white placeholder:text-white/40 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50" size={20} />

            {/* LIVE SUGGESTIONS */}
            {search.trim().length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#05060a] rounded-4xl shadow-[0_30px_90px_rgba(0,0,0,0.42)] border border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                 <div className="p-4 border-b border-white/10 flex justify-between items-center">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Product Suggestions</p>
                   <button onClick={() => setSearch("")} className="text-[10px] font-bold uppercase tracking-widest text-white hover:opacity-60 transition-opacity">Clear</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                  {products
                    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                    .slice(0, 5)
                    .map((p) => (
                      <div 
                        key={p._id} 
                        onClick={() => {
                          navigate(`/productdetail/${p._id}`);
                          setShowSearch(false);
                          setSearch("");
                        }}
                        className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition-colors group border-b border-white/5 last:border-none"
                      >
                        <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white/10">
                          <img src={p.image1} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{p.name}</p>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{p.category} • {p.subCategory}</p>
                        </div>
                        <p className="text-sm font-semibold text-white">{currency}{p.price}</p>
                      </div>
                    ))}
                  
                  {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                    <div className="p-12 text-center">
                       <p className="text-sm text-white/50">No results found for "<span className="font-semibold text-white">{search}</span>"</p>
                    </div>
                  )}
                </div>
                {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length > 5 && (
                  <button 
                    onClick={() => { navigate("/collection"); setShowSearch(false); }}
                    className="w-full py-4 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    View All {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length} Results
                    <FiChevronRight />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showMobileNav && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowMobileNav(false)} />
          <div className="absolute left-0 top-0 h-screen w-[85%] max-w-sm bg-[#05060a] shadow-2xl flex flex-col p-8 animate-in slide-in-from-left duration-300 text-white">
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-2xl font-light tracking-tight">OneCart<span className="font-bold"></span></h1>
              <button onClick={() => setShowMobileNav(false)} className="p-2 -mr-2"><FiX size={24} /></button>
            </div>

            <nav className="flex flex-col gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-2xl font-light tracking-tight text-white border-b border-white/8 pb-4"
                  onClick={() => setShowMobileNav(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-10">
               <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-4">Account</p>
               {isLoggedIn ? (
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl" onClick={() => navigate("/account")}> 
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">{userInitial}</div>
                    <div className="flex-1 truncate">
                      <p className="font-medium truncate">{userDisplayName}</p>
                      <p className="text-xs text-white/50">View Profile</p>
                    </div>
                  </div>
               ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-4 bg-white text-black rounded-full font-medium tracking-widest uppercase text-xs"
                  >
                    Sign In
                  </button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function MenuLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}
