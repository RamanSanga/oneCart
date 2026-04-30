import React, { Suspense, lazy, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { adminDataContext } from "./context/AdminContext.jsx";
import { authDataContext } from "./context/AuthContext.jsx";
import Layout from "./Layout.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Add = lazy(() => import("./pages/Add.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const List = lazy(() => import("./pages/List.jsx"));
const Coupons = lazy(() => import("./pages/Coupons.jsx"));
const Reviews = lazy(() => import("./pages/Reviews.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const StockAlerts = lazy(() => import("./pages/StockAlerts.jsx"));
const Leads = lazy(() => import("./pages/Leads.jsx"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="rounded-3xl border border-black/5 bg-white px-6 py-4 text-sm tracking-wide text-gray-500 shadow-sm">
        Loading...
      </div>
    </div>
  );
}

function App() {
  const { adminData } = useContext(adminDataContext);
  const { serverUrl } = useContext(authDataContext);

  if (!adminData) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home url={serverUrl} />} />
          <Route path="/add" element={<Add url={serverUrl} />} />
          <Route path="/list" element={<List url={serverUrl} />} />
          <Route path="/orders" element={<Orders url={serverUrl} />} />
          <Route path="/coupons" element={<Coupons url={serverUrl} />} />
          <Route path="/reviews" element={<Reviews url={serverUrl} />} />
          <Route path="/settings" element={<Settings url={serverUrl} />} />
          <Route path="/stock-alerts" element={<StockAlerts url={serverUrl} />} />
          <Route path="/leads" element={<Leads url={serverUrl} />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
