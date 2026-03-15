import { useState } from "react";
import Nav from "./component/Nav";
import Sidebar from "./component/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      <Nav onMenuClick={() => setIsOpen(true)} />
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="pt-[72px] sm:pt-[80px] md:pl-[96px] lg:pl-[250px] transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
}
