import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Add from "./pages/Add.jsx";
import Orders from "./pages/Orders.jsx";
import List from "./pages/List.jsx";
import { adminDataContext } from "./context/AdminContext.jsx";
import Layout from "./Layout.jsx";

function App() {
  const { adminData } = useContext(adminDataContext);

  if (!adminData) {
    return <Login />;
  }

  return (
    <Routes>
      {/* Login route */}
      <Route path="/login" element={<Login />} />

      {/* Protected admin routes inside layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/list" element={<List />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
