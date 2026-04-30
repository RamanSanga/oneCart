import React, { Suspense, lazy, useContext } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";

const Registration = lazy(() => import("./Pages/Registration.jsx"));
const Home = lazy(() => import("./Pages/Home.jsx"));
const Login = lazy(() => import("./Pages/Login.jsx"));
const Contact = lazy(() => import("./Pages/Contact.jsx"));
const Collections = lazy(() => import("./Pages/Collections.jsx"));
const About = lazy(() => import("./Pages/About.jsx"));
const Product = lazy(() => import("./Pages/Product.jsx"));
import Nav from "./component/Nav.jsx";
const ProductDetail = lazy(() => import("./Pages/ProductDetail.jsx"));
const Cart = lazy(() => import("./Pages/Cart.jsx"));
const PlaceOrder = lazy(() => import("./Pages/PlaceOrder.jsx"));
const OrderSuccess = lazy(() => import("./Pages/OrderSuccess"));
const Order = lazy(() => import("./Pages/Order.jsx"));
const Account = lazy(() => import("./Pages/Account.jsx"));
const Wishlist = lazy(() => import("./Pages/Wishlist"));
const NotFound = lazy(() => import("./Pages/NotFound"));
import Ai from "./component/Ai.jsx";

import { userDataContext } from "./Context/UserContext.jsx";

function App() {
  const { userData, authReady } = useContext(userDataContext);
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />
          <p className="text-sm text-gray-500 tracking-widest uppercase">Initializing OneCart</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={userData ? <Navigate to="/" /> : <Registration />} />

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collection" element={<Collections />} />
          <Route path="/product" element={<Product />} />
          <Route path="/productdetail/:id" element={<ProductDetail />} />

          {/* Cart is now PUBLIC for Guest-First experience */}
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/placeorder"
            element={
              userData ? (
                <PlaceOrder />
              ) : (
                <AuthGate
                  title="Sign in to checkout"
                  message="Please sign in to place your order and continue checkout securely."
                  from={location}
                />
              )
            }
          />

          <Route
            path="/ordersuccess"
            element={
              userData ? (
                <OrderSuccess />
              ) : (
                <AuthGate
                  title="Confirm your session"
                  message="We need to verify your account before showing order details."
                  from={location}
                />
              )
            }
          />

          <Route
            path="/order"
            element={
              userData ? (
                <Order />
              ) : (
                <AuthGate
                  title="View your orders"
                  message="Sign in to track your current orders and view order history."
                  from={location}
                />
              )
            }
          />

          <Route
            path="/account"
            element={
              userData ? (
                <Account />
              ) : (
                <AuthGate
                  title="Access your account"
                  message="Manage your profile, addresses, and settings after login."
                  from={location}
                />
              )
            }
          />

          <Route
            path="/wishlist"
            element={
              userData ? (
                <Wishlist />
              ) : (
                <AuthGate
                  title="Save your favorites"
                  message="Sign in to keep your curated wishlist synced across all your devices."
                  from={location}
                />
              )
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Ai />
    </>
  );
}

function AuthGate({ title, message, from }) {
  return (
    <section className="min-h-[85vh] bg-[#faf9f5] px-6 pt-[120px] pb-20 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-[40px] border border-gray-200 bg-white p-10 sm:p-16 text-center shadow-[0_25px_80px_rgba(15,23,42,0.06)] transform transition hover:scale-[1.01]">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-xl">
          <FiUserIcon />
        </div>

        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-950 mb-6">{title}</h1>
        <p className="text-base sm:text-lg leading-relaxed text-gray-500 mb-10 px-4">{message}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            state={{ from }}
            className="w-full sm:w-auto min-w-[180px] rounded-full bg-black px-8 py-4 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-gray-800 shadow-lg"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            state={{ from }}
            className="w-full sm:w-auto min-w-[180px] rounded-full border border-gray-300 px-8 py-4 text-sm font-medium uppercase tracking-widest text-gray-700 transition hover:border-black hover:bg-gray-50"
          >
            Create account
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link
            to="/collection"
            className="text-sm font-medium text-gray-400 uppercase tracking-widest transition hover:text-black"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />
        <p className="text-sm text-gray-500 tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}

function FiUserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

export default App;
