import React, { Suspense, lazy, useContext } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";

const Registration  = lazy(() => import("./Pages/Registration.jsx"));
const Home          = lazy(() => import("./Pages/Home.jsx"));
const Login         = lazy(() => import("./Pages/Login.jsx"));
const Contact       = lazy(() => import("./Pages/Contact.jsx"));
const Collections   = lazy(() => import("./Pages/Collections.jsx"));
const About         = lazy(() => import("./Pages/About.jsx"));
const ProductDetail = lazy(() => import("./Pages/ProductDetail.jsx"));
const Cart          = lazy(() => import("./Pages/Cart.jsx"));
const PlaceOrder    = lazy(() => import("./Pages/PlaceOrder.jsx"));
const OrderSuccess  = lazy(() => import("./Pages/OrderSuccess"));
const Order         = lazy(() => import("./Pages/Order.jsx"));
const Account       = lazy(() => import("./Pages/Account.jsx"));
const Wishlist      = lazy(() => import("./Pages/Wishlist"));
const NotFound      = lazy(() => import("./Pages/NotFound"));

import Nav from "./component/Nav.jsx";
import Ai  from "./component/Ai.jsx";

import { userDataContext } from "./Context/UserContext.jsx";

export default function App() {
  const { userData, authReady } = useContext(userDataContext);
  const location = useLocation();

  const PROTECTED_ROUTES = ["/placeorder", "/ordersuccess", "/order", "/account", "/wishlist"];
  const isProtectedRoute = PROTECTED_ROUTES.includes(location.pathname);

  if (isProtectedRoute && !authReady) return <Splash />;

  return (
    <>
      <Nav />
      <Suspense fallback={<Splash />}>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login"  element={userData ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={userData ? <Navigate to="/" replace /> : <Registration />} />

          {/* Public shop routes */}
          <Route path="/"                    element={<Home />} />
          <Route path="/about"               element={<About />} />
          <Route path="/contact"             element={<Contact />} />
          <Route path="/collection"          element={<Collections />} />
          <Route path="/productdetail/:id"   element={<ProductDetail />} />
          <Route path="/cart"                element={<Cart />} />

          {/* Protected routes */}
          <Route path="/placeorder"  element={userData ? <PlaceOrder />  : <AuthGate title="Sign in to checkout"      message="Please sign in to place your order securely."                    from={location} />} />
          <Route path="/ordersuccess" element={userData ? <OrderSuccess /> : <AuthGate title="Confirm your session"   message="We need to verify your account before showing order details."    from={location} />} />
          <Route path="/order"       element={userData ? <Order />       : <AuthGate title="View your orders"         message="Sign in to track your current orders and view order history."    from={location} />} />
          <Route path="/account"     element={userData ? <Account />     : <AuthGate title="Access your account"      message="Manage your profile, addresses, and settings after signing in."  from={location} />} />
          <Route path="/wishlist"    element={userData ? <Wishlist />    : <AuthGate title="Save your favourites"     message="Sign in to keep your wishlist synced across all your devices."   from={location} />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Ai />
    </>
  );
}

/* ── Brand splash / loading ── */
function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
      <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-[var(--ink)] opacity-60 animate-pulse select-none">
        OneCart
      </p>
    </div>
  );
}

/* ── Auth gate — shown when a protected route is accessed without signing in ── */
function AuthGate({ title, message, from }) {
  return (
    <div
      className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center text-center px-6"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)] mb-6">OneCart</p>

      <h1
        className="font-display font-light text-[var(--ink)] mb-4 leading-tight"
        style={{ fontSize: "clamp(26px, 4vw, 44px)" }}
      >
        {title}
      </h1>

      <p className="text-[13px] font-light text-[var(--ink-60)] max-w-[42ch] mb-10 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/login"
          state={{ from }}
          className="px-8 py-3.5 bg-[var(--ink)] text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--ink-80)] transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          state={{ from }}
          className="px-8 py-3.5 border border-[var(--border-md)] text-[var(--ink)] text-[10px] font-semibold uppercase tracking-[0.2em] hover:border-[var(--ink)] transition-colors"
        >
          Create Account
        </Link>
      </div>

      <Link
        to="/collection"
        className="mt-8 text-[10px] font-medium uppercase tracking-widest text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors"
      >
        Browse without signing in →
      </Link>
    </div>
  );
}
