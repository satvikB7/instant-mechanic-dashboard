import {
  NavLink,
} from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Car,
  Wrench,
  Settings,
  ClipboardList,
} from "lucide-react";

interface SidebarProps {
  darkMode: boolean;
}

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    path: "/bookings",
    icon: CalendarDays,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: Car,
  },
  {
    name: "Mechanics",
    path: "/mechanics",
    icon: Wrench,
  },
  {
    name: "Services",
    path: "/services",
    icon: ClipboardList,
  },
];

function Sidebar({ darkMode }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 text-white ${
        darkMode
          ? "bg-slate-950"
          : "bg-slate-900"
      }`}
    >

      {/* Logo */}
      <div
        className={`flex h-16 items-center border-b px-6 ${
          darkMode
            ? "border-slate-800"
            : "border-slate-700"
        }`}
      >
        <div>
          <h1 className="text-lg font-bold">
            Instant Mechanic
          </h1>

          <p className="text-xs text-slate-400">
            Admin Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "text-slate-400 hover:bg-slate-900 hover:text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span>
                {item.name}
              </span>
            </NavLink>
          );
        })}

      </nav>

      {/* Settings */}
      <div className="absolute bottom-4 left-4 right-4">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
              isActive
                ? "bg-blue-600 text-white"
                : darkMode
                ? "text-slate-400 hover:bg-slate-900 hover:text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`
          }
        >
          <Settings size={20} />

          Settings
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;