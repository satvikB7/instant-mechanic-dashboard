import { useState } from "react";

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function Settings({
  darkMode,
  setDarkMode,
}: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode
              ? "text-white"
              : "text-slate-900"
          }`}
        >
          Settings
        </h1>

        <p
          className={`mt-1 text-sm ${
            darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          Manage your application preferences.
        </p>
      </div>

      {/* Appearance */}
      <div
        className={`rounded-xl border shadow-sm ${
          darkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`border-b p-5 ${
            darkMode
              ? "border-slate-700"
              : "border-slate-200"
          }`}
        >
          <h2
            className={`font-semibold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            Appearance
          </h2>

          <p
            className={`mt-1 text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Customize how the dashboard looks.
          </p>
        </div>

        <div className="flex items-center justify-between p-5">

          <div>
            <p
              className={`font-medium ${
                darkMode
                  ? "text-slate-200"
                  : "text-slate-800"
              }`}
            >
              Dark Mode
            </p>

            <p
              className={`text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Use a darker theme across the dashboard.
            </p>
          </div>

          <button
            onClick={() =>
              setDarkMode((previous) => !previous)
            }
            className={`relative h-6 w-11 rounded-full transition ${
              darkMode
                ? "bg-blue-600"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                darkMode
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>

        </div>
      </div>

      {/* General Settings */}
      <div
        className={`rounded-xl border shadow-sm ${
          darkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >

        <div
          className={`border-b p-5 ${
            darkMode
              ? "border-slate-700"
              : "border-slate-200"
          }`}
        >
          <h2
            className={`font-semibold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            General Settings
          </h2>

          <p
            className={`mt-1 text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Configure basic dashboard behaviour.
          </p>
        </div>

        <div
          className={`divide-y ${
            darkMode
              ? "divide-slate-700"
              : "divide-slate-100"
          }`}
        >

          {/* Notifications */}
          <div className="flex items-center justify-between p-5">

            <div>
              <p
                className={`font-medium ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-800"
                }`}
              >
                Notifications
              </p>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Receive notifications for important booking updates.
              </p>
            </div>

            <button
              onClick={() =>
                setNotifications(!notifications)
              }
              className={`relative h-6 w-11 rounded-full transition ${
                notifications
                  ? "bg-blue-600"
                  : darkMode
                  ? "bg-slate-700"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          {/* Email Alerts */}
          <div className="flex items-center justify-between p-5">

            <div>
              <p
                className={`font-medium ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-800"
                }`}
              >
                Email Alerts
              </p>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Receive email alerts about service activity.
              </p>
            </div>

            <button
              onClick={() =>
                setEmailAlerts(!emailAlerts)
              }
              className={`relative h-6 w-11 rounded-full transition ${
                emailAlerts
                  ? "bg-blue-600"
                  : darkMode
                  ? "bg-slate-700"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  emailAlerts
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          {/* Auto Refresh */}
          <div className="flex items-center justify-between p-5">

            <div>
              <p
                className={`font-medium ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-800"
                }`}
              >
                Auto Refresh
              </p>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Automatically refresh dashboard data.
              </p>
            </div>

            <button
              onClick={() =>
                setAutoRefresh(!autoRefresh)
              }
              className={`relative h-6 w-11 rounded-full transition ${
                autoRefresh
                  ? "bg-blue-600"
                  : darkMode
                  ? "bg-slate-700"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  autoRefresh
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

        </div>
      </div>

      {/* Application Information */}
      <div
        className={`rounded-xl border shadow-sm ${
          darkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >

        <div
          className={`border-b p-5 ${
            darkMode
              ? "border-slate-700"
              : "border-slate-200"
          }`}
        >
          <h2
            className={`font-semibold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            Application Information
          </h2>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">

          <div>
            <p className="text-xs font-medium uppercase text-slate-400">
              Application
            </p>

            <p
              className={`mt-1 text-sm font-medium ${
                darkMode
                  ? "text-slate-200"
                  : "text-slate-800"
              }`}
            >
              Instant Mechanic Dashboard
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-400">
              Version
            </p>

            <p
              className={`mt-1 text-sm font-medium ${
                darkMode
                  ? "text-slate-200"
                  : "text-slate-800"
              }`}
            >
              1.0.0
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-400">
              Environment
            </p>

            <p
              className={`mt-1 text-sm font-medium ${
                darkMode
                  ? "text-slate-200"
                  : "text-slate-800"
              }`}
            >
              Development
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-400">
              Status
            </p>

            <p className="mt-1 text-sm font-medium text-green-600">
              System Operational
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Settings;