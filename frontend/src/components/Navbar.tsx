import {
  Bell,
  UserCircle,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({
  darkMode,
  setDarkMode,
}: NavbarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    navigate("/login");
  }

  return (
    <header
      className={`fixed left-64 right-0 top-0 z-10 h-16 border-b ${
        darkMode
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex h-full items-center justify-between px-6">

        {/* Title */}
        <div>
          <h2
            className={`text-lg font-semibold ${
              darkMode
                ? "text-white"
                : "text-slate-800"
            }`}
          >
            Instant Mechanic
          </h2>
        </div>

        <div className="flex items-center gap-5">

          {/* Dark Mode */}
          <button
            onClick={() =>
              setDarkMode((previous) => !previous)
            }
            className={`rounded-lg p-2 transition ${
              darkMode
                ? "text-yellow-400 hover:bg-slate-800"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Notifications */}
          <button
            className={`relative ${
              darkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bell size={20} />

            <span className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2">

            <UserCircle
              size={30}
              className={
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }
            />

            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                Admin
              </p>

              <p
                className={`text-xs ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Administrator
              </p>
            </div>

          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              darkMode
                ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;