import { useNavigate, useLocation } from "react-router-dom";
import {
  FiPlus,
  FiList,
  FiCheckCircle,
  FiX,
  FiHome,
} from "react-icons/fi";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: FiHome, path: "/" },
    { label: "Add Items", icon: FiPlus, path: "/add" },
    { label: "List Items", icon: FiList, path: "/list" },
    { label: "Orders", icon: FiCheckCircle, path: "/orders" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 z-50 md:z-40
          top-[72px] sm:top-[80px]
          h-[calc(100vh-72px)] sm:h-[calc(100vh-80px)]
          bg-white/95 backdrop-blur-xl border-r border-black/5
          shadow-[0_10px_40px_rgba(0,0,0,0.06)] md:shadow-none
          transition-transform duration-300 ease-in-out
          
          w-[280px] sm:w-[300px] md:w-[96px] lg:w-[250px]
          
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* MOBILE DRAWER HEADER */}
        <div className="md:hidden flex items-center justify-between px-5 py-5 border-b border-black/5">
          <div>
            <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500 mb-1">
              Navigation
            </p>
            <h2 className="text-lg font-medium">Admin Menu</h2>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-2xl border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* DESKTOP MINI HEADER */}
        <div className="hidden md:flex lg:hidden items-center justify-center py-5">
          <div className="w-10 h-10 rounded-2xl border border-black/10 bg-[#fafaf8] flex items-center justify-center text-xs font-medium">
            OC
          </div>
        </div>

        {/* FULL HEADER */}
        <div className="hidden lg:block px-5 pt-6 pb-4">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-2">
            Workspace
          </p>
          <div className="h-px bg-black/5 w-full" />
        </div>

        {/* NAV */}
        <nav className="px-3 md:px-3 lg:px-4 py-4 flex flex-col gap-2">
          {menu.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;

            return (
              <button
                key={label}
                onClick={() => handleNavigate(path)}
                className={`
                  group relative w-full rounded-2xl transition-all duration-300
                  flex items-center gap-3
                  px-4 py-3.5
                  md:px-0 md:py-3.5 md:justify-center
                  lg:px-4 lg:justify-start
                  ${
                    active
                      ? "bg-black text-white shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
                      : "text-gray-600 hover:bg-[#f7f7f3] hover:text-black"
                  }
                `}
              >
                <Icon className="text-[18px] min-w-[18px]" />

                <span className="text-sm font-medium md:hidden lg:inline">
                  {label}
                </span>

                {/* mini tooltip-like dot on md */}
                {!active && (
                  <span className="hidden md:block lg:hidden absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-black/20 transition" />
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM PANEL */}
        <div className="mt-auto px-3 md:px-3 lg:px-4 pb-5">
          <div className="rounded-2xl border border-black/5 bg-[#fafaf8] p-4 hidden lg:block">
            <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500 mb-2">
              One Cart
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Premium admin experience designed for products, orders, and store
              operations.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
