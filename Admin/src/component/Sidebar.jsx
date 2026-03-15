import { useNavigate, useLocation } from "react-router-dom";
import { FiPlus, FiList, FiCheckCircle, FiX, FiHome } from "react-icons/fi";

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
    setIsOpen(false); // close on mobile after click
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-[73px] sm:top-[81px] left-0 z-50 md:z-40
          h-[calc(100vh-73px)] sm:h-[calc(100vh-81px)]
          bg-white border-r border-gray-200 shadow-sm md:shadow-none
          transition-transform duration-300 ease-in-out
          
          w-[260px] md:w-[88px] lg:w-[92px]
          
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Mobile header inside drawer */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-500">Menu</p>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <nav className="mt-4 md:mt-8 flex flex-col gap-2 px-2 md:px-3">
          {menu.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;

            return (
              <button
                key={label}
                onClick={() => handleNavigate(path)}
                className={`
                  relative flex items-center gap-3 md:gap-0 md:justify-center lg:justify-start
                  w-full rounded-2xl px-4 md:px-0 lg:px-4 py-3
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  }
                `}
              >
                <Icon className="text-[18px] min-w-[18px]" />

                {/* Show labels on mobile + large desktop */}
                <span className="md:hidden lg:inline whitespace-nowrap">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
