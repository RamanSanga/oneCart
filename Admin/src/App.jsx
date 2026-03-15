import React, { useContext, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Add from "./pages/Add.jsx";
import Orders from "./pages/Orders.jsx";
import List from "./pages/List.jsx";
import { adminDataContext } from "./context/AdminContext.jsx";
import Nav from "./component/Nav.jsx";
import Sidebar from "./component/Sidebar.jsx";

function App() {
  const { adminData } = useContext(adminDataContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (!adminData) {
    return <Login />;
  }

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-black">
      {!isLoginPage && (
        <>
          <Nav onMenuClick={() => setIsSidebarOpen(true)} />
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </>
      )}

      <main
        className={`
          pt-[73px] sm:pt-[81px]
          min-h-screen
          transition-all duration-300
          md:pl-[88px] lg:pl-[92px]
        `}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
