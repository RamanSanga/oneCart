import { useState, useRef, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch, FiShoppingBag, FiX, FiMenu, FiHeart,
  FiUser, FiPackage, FiSettings, FiLogOut, FiArrowRight,
} from "react-icons/fi";
import axios from "axios";

import { userDataContext }  from "../Context/UserContext";
import { authDataContext }  from "../Context/AuthContext";
import { shopDataContext }  from "../Context/ShopContext";
import { useToast }         from "../Context/ToastContext";

const NAV_LINKS = [
  { label: "Home",        path: "/" },
  { label: "Collections", path: "/collection" },
  { label: "About",       path: "/about" },
  { label: "Contact",     path: "/contact" },
];

const DEPARTMENTS = [
  { label: "Men",       param: "?category=Men" },
  { label: "Women",     param: "?category=Women" },
  { label: "Kids",      param: "?category=Kids" },
  { label: "Top Wear",  param: "?subcategory=TopWear" },
  { label: "Bottom Wear", param: "?subcategory=BottomWear" },
  { label: "Winter Wear", param: "?subcategory=WinterWear" },
];

export default function Navbar() {
  const { showSearch, setShowSearch, search, setSearch, cartCount, wishlistCount, products, currency } = useContext(shopDataContext);
  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl }             = useContext(authDataContext);
  const toast     = useToast();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [showMenu,      setShowMenu]      = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isScrolled,   setIsScrolled]    = useState(false);
  const [banner,       setBanner]        = useState({ text: "", active: false });

  const menuRef        = useRef(null);
  const searchInputRef = useRef(null);

  const isLoggedIn  = Boolean(userData?._id || userData?.name);
  const userInitial = useMemo(() => (userData?.name ? userData.name.charAt(0).toUpperCase() : ""), [userData?.name]);
  const isHome      = location.pathname === "/" && !isScrolled;

  /* ── focus search on open ── */
  useEffect(() => {
    if (showSearch && searchInputRef.current) searchInputRef.current.focus();
  }, [showSearch]);

  /* ── ESC closes search ── */
  useEffect(() => {
    const onEsc = e => { if (e.key === "Escape") { setShowSearch(false); setSearch(""); } };
    if (showSearch) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showSearch, setSearch, setShowSearch]);

  /* ── close user menu on outside click ── */
  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── close overlays on route change ── */
  useEffect(() => {
    setShowMenu(false);
    setShowMobileNav(false);
    setShowSearch(false);
    setSearch("");
  }, [location.pathname, location.search]);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── offer banner ── */
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/admin/settings/public`);
        if (res.data.success) {
          const b = res.data.settings.find(s => s.key === "offer_banner");
          if (b) setBanner(b.value);
        }
      } catch {}
    };
    fetchBanner();
  }, [serverUrl]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      toast.success({ title: "Signed out", message: "See you soon.", dedupeKey: "auth:logout" });
      navigate("/");
    } catch {
      toast.error({ title: "Error", message: "Could not sign out. Try again." });
    }
  };

  /* ── live search ── */
  const searchResults = useMemo(() => {
    if (!search.trim() || search.trim().length < 2) return [];
    return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6);
  }, [search, products]);

  const navClass = isHome ? "nav-transparent" : "nav-scrolled";
  const iconColor = "text-[var(--ink)]";

  return (
    <>
      {/* ── OFFER BANNER ── */}
      {banner.active && banner.text && (
        <div className="w-full bg-[var(--ink)] text-white text-[10px] font-medium tracking-[0.2em] uppercase text-center py-2.5 px-4 z-50 relative select-none">
          {banner.text}
        </div>
      )}

      <nav
        className={`w-full fixed left-0 z-40 transition-all duration-300 ${navClass} ${banner.active && banner.text && !isScrolled ? "top-[37px]" : "top-0"}`}
        role="navigation"
        aria-label="Primary"
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16 h-[var(--nav-height)]">

          {/* ── LEFT: hamburger + wordmark ── */}
          <div className="flex items-center gap-5">
            <button
              className="md:hidden p-1 -ml-1"
              onClick={() => setShowMobileNav(true)}
              aria-label="Open menu"
              aria-expanded={showMobileNav}
            >
              <FiMenu size={22} className={iconColor} />
            </button>

            <button
              onClick={() => navigate("/")}
              className={`text-[17px] font-semibold tracking-[0.14em] uppercase font-body transition-colors ${iconColor}`}
              aria-label="OneCart — go to homepage"
            >
              OneCart
            </button>
          </div>

          {/* ── CENTER: desktop nav ── */}
          <div className="hidden md:flex items-center gap-9" role="navigation" aria-label="Main">
            {NAV_LINKS.map(item => (
              <Link
                key={item.label}
                to={item.path}
                className={`relative text-[12px] font-medium tracking-wide transition-colors group pb-0.5 text-[var(--ink-60)] hover:text-[var(--ink)] ${location.pathname === item.path ? "!text-[var(--ink)]" : ""}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-300 ${
                  location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
          </div>

          {/* ── RIGHT: icons ── */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* Search */}
            <button
              aria-label={showSearch ? "Close search" : "Open search"}
              onClick={() => {
                if (showSearch) { setShowSearch(false); setSearch(""); }
                else { setShowSearch(true); navigate("/collection"); }
              }}
              className={`p-1 transition-opacity hover:opacity-60 ${iconColor}`}
            >
              {showSearch ? <FiX size={20} /> : <FiSearch size={19} />}
            </button>

            {/* Wishlist */}
            <button
              aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
              onClick={() => navigate("/wishlist")}
              className={`relative p-1 transition-opacity hover:opacity-60 ${iconColor}`}
            >
              <FiHeart size={19} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[9px] font-semibold">
                  ({wishlistCount})
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(p => !p)}
                aria-label="Account menu"
                aria-expanded={showMenu}
                className={`p-1 transition-opacity hover:opacity-60 ${iconColor}`}
              >
                {isLoggedIn
                  ? <span className={`text-[11px] font-semibold tracking-wide border-b pb-0.5 ${isHome ? "border-white text-white" : "border-[var(--ink)] text-[var(--ink)]"}`}>{userInitial}</span>
                  : <FiUser size={19} />
                }
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white text-[var(--ink)] border border-[var(--border-md)] shadow-[0_8px_40px_rgba(0,0,0,0.10)] py-1 z-50 animate-fadeIn">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-[var(--border)]">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--ink-40)] mb-0.5">Signed in as</p>
                        <p className="text-[13px] font-medium text-[var(--ink)] truncate">{userData?.name}</p>
                      </div>
                      <MenuLink to="/order"   icon={<FiPackage  size={14} />} label="My Orders" />
                      <MenuLink to="/account" icon={<FiSettings size={14} />} label="Account Settings" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut size={14} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-[var(--border)]">
                        <p className="text-[12px] text-[var(--ink-60)] leading-relaxed font-light">Sign in to sync your cart and wishlist.</p>
                      </div>
                      <MenuLink to="/login"  icon={<FiArrowRight size={14} />} label="Sign In" />
                      <MenuLink to="/signup" icon={<FiArrowRight size={14} />} label="Create Account" />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              aria-label={`Shopping bag${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
              onClick={() => navigate("/cart")}
              className={`relative p-1 transition-opacity hover:opacity-60 ${iconColor}`}
            >
              <FiShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[9px] font-semibold">({cartCount})</span>
              )}
            </button>
          </div>
        </div>

        {/* ── SEARCH OVERLAY ── */}
        {showSearch && (
          <div className="w-full bg-[var(--ink)] border-t border-white/10 px-6 py-5 animate-fadeIn">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 border-b border-white/20 pb-3">
                <FiSearch size={18} className="text-white/50 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 bg-transparent outline-none text-white text-[15px] font-light placeholder:text-white/30"
                  aria-label="Search"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-white/50 hover:text-white transition-colors" aria-label="Clear search">
                    <FiX size={16} />
                  </button>
                )}
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="mt-3 divide-y divide-white/8">
                  {searchResults.map(p => (
                    <button
                      key={p._id}
                      onClick={() => { navigate(`/productdetail/${p._id}`); setShowSearch(false); setSearch(""); }}
                      className="w-full flex items-center gap-4 py-3 text-left hover:opacity-70 transition-opacity"
                    >
                      <div className="w-10 h-12 bg-white/10 shrink-0 overflow-hidden">
                        <img src={p.image1} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white font-light truncate">{p.name}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{p.category} · {p.subCategory}</p>
                      </div>
                      <p className="text-[13px] text-white/70 font-medium shrink-0">{currency}{p.price}</p>
                    </button>
                  ))}
                  {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length > 6 && (
                    <button
                      onClick={() => { navigate("/collection"); setShowSearch(false); }}
                      className="w-full py-3 text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors text-center"
                    >
                      View all results →
                    </button>
                  )}
                </div>
              )}
              {search.trim().length >= 2 && searchResults.length === 0 && (
                <p className="mt-4 text-[12px] text-white/40 font-light">No results for "<span className="text-white">{search}</span>"</p>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── MOBILE NAV FULLSCREEN ── */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="absolute inset-0 bg-[var(--ink)]">
            <div className="flex flex-col h-full px-8 pt-8 pb-12 overflow-y-auto">
              {/* header */}
              <div className="flex items-center justify-between mb-14 shrink-0">
                <span className="text-white text-[17px] font-semibold tracking-[0.14em] uppercase font-body">OneCart</span>
                <button onClick={() => setShowMobileNav(false)} className="text-white/60 hover:text-white transition-colors p-1" aria-label="Close menu">
                  <FiX size={22} />
                </button>
              </div>

              {/* main links */}
              <nav className="flex flex-col">
                {NAV_LINKS.map((item, i) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="text-white text-[26px] font-light font-display border-b border-white/10 py-4 tracking-tight leading-tight hover:text-white/60 transition-colors"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* department shortcuts */}
              <div className="mt-10 shrink-0">
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Shop By</p>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map(d => (
                    <button
                      key={d.label}
                      onClick={() => { navigate(`/collection${d.param}`); setShowMobileNav(false); }}
                      className="text-[11px] font-medium uppercase tracking-[0.15em] px-3 py-1.5 border border-white/20 text-white/70 hover:border-white hover:text-white transition-colors"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* account */}
              <div className="mt-auto shrink-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-4">Account</p>
                {isLoggedIn ? (
                  <button
                    className="flex items-center gap-4 text-left w-full"
                    onClick={() => { navigate("/account"); setShowMobileNav(false); }}
                  >
                    <div className="w-9 h-9 bg-white text-[var(--ink)] flex items-center justify-center text-[12px] font-semibold shrink-0">
                      {userInitial}
                    </div>
                    <div>
                      <p className="text-white text-[13px] font-medium">{userData?.name}</p>
                      <p className="text-white/40 text-[11px]">View profile →</p>
                    </div>
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => { navigate("/login");  setShowMobileNav(false); }} className="text-left text-white text-[13px] font-medium hover:opacity-60 transition-opacity">Sign In →</button>
                    <button onClick={() => { navigate("/signup"); setShowMobileNav(false); }} className="text-left text-white/50 text-[12px] hover:opacity-60 transition-opacity">Create account</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuLink({ to, icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-[var(--ink-60)] hover:text-[var(--ink)] hover:bg-[var(--ink-06)] transition-colors">
      <span className="text-[var(--ink-40)]">{icon}</span>
      {label}
    </Link>
  );
}
