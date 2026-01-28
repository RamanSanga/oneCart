// src/components/AdminSidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { FiPlus, FiList, FiCheckCircle } from "react-icons/fi";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Add Items", icon: FiPlus, path: "/add" },
    { label: "List Items", icon: FiList, path: "/list" },
    { label: "Orders", icon: FiCheckCircle, path: "/orders" },
  ];

  return (
    <aside
      className="
        group
        fixed left-0 top-[72px]
        h-[calc(100vh-72px)]
        bg-white
        border-r border-gray-200
        w-[60px] hover:w-[200px]
        transition-all duration-300 ease-in-out
        overflow-hidden
      "
    >
      <nav className="mt-12 flex flex-col gap-6">
        {menu.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`
                flex items-center gap-4
                px-5 py-2
                text-[14px] font-light tracking-wide
                transition-all duration-200
                ${
                  active
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }
              `}
            >
              {/* Icon */}
              <Icon className="text-[18px] min-w-[18px]" />

              {/* Text (appears on hover) */}
              <span
                className="
                  whitespace-nowrap
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-200
                "
              >
                {label}
              </span>

              {/* Active underline */}
              {active && (
                <span className="absolute left-0 h-full w-[2px] bg-black" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

