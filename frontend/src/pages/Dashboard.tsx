import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import api from "../services/api";

import StatCard from "../components/StatCard";

import type {
  DashboardData,
} from "../types/dashboard";

interface DashboardProps {
  darkMode: boolean;
}

function Dashboard({ darkMode }: DashboardProps) {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const response =
          await api.get<DashboardData>(
            "/dashboard"
          );

        setDashboard(response.data);
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p
          className={
            darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }
        >
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div
        className={`rounded-lg border p-5 ${
          darkMode
            ? "border-red-900 bg-red-950 text-red-400"
            : "border-red-200 bg-red-50 text-red-600"
        }`}
      >
        {error || "No dashboard data available."}
      </div>
    );
  }

  const {
    summary,
    bookingsOverTime,
    serviceBreakdown,
    statusDistribution,
    recentBookings,
    mechanicWorkload,
  } = dashboard;

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
          Dashboard
        </h1>

        <p
          className={`mt-1 text-sm ${
            darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          Overview of your mechanic service operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Bookings"
          value={summary.totalBookings.toLocaleString()}
          description="All bookings"
          darkMode={darkMode}
        />

        <StatCard
          title="Total Customers"
          value={summary.totalCustomers.toLocaleString()}
          description="Registered customers"
          darkMode={darkMode}
        />

        <StatCard
          title="Active Mechanics"
          value={summary.activeMechanics.toLocaleString()}
          description="Currently active"
          darkMode={darkMode}
        />

        <StatCard
          title="Total Revenue"
          value={`₹${summary.totalRevenue.toLocaleString("en-IN")}`}
          description="Completed bookings"
          darkMode={darkMode}
        />

      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Bookings Over Time */}
        <div
          className={`rounded-xl border p-5 shadow-sm ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mb-4">
            <h2
              className={`font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              Bookings Over Time
            </h2>

            <p
              className={`text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Daily booking activity
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={bookingsOverTime}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={
                    darkMode
                      ? "#334155"
                      : "#e2e8f0"
                  }
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                    fill: darkMode
                      ? "#94a3b8"
                      : "#64748b",
                  }}
                />

                <YAxis
                  tick={{
                    fill: darkMode
                      ? "#94a3b8"
                      : "#64748b",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode
                      ? "#0f172a"
                      : "#ffffff",
                    borderColor: darkMode
                      ? "#334155"
                      : "#e2e8f0",
                    color: darkMode
                      ? "#f8fafc"
                      : "#0f172a",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Breakdown */}
        <div
          className={`rounded-xl border p-5 shadow-sm ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mb-4">
            <h2
              className={`font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              Service Breakdown
            </h2>

            <p
              className={`text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Bookings by service
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={serviceBreakdown}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={
                    darkMode
                      ? "#334155"
                      : "#e2e8f0"
                  }
                />

                <XAxis
                  dataKey="service"
                  tick={{
                    fontSize: 10,
                    fill: darkMode
                      ? "#94a3b8"
                      : "#64748b",
                  }}
                  angle={-25}
                  textAnchor="end"
                  height={70}
                />

                <YAxis
                  tick={{
                    fill: darkMode
                      ? "#94a3b8"
                      : "#64748b",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode
                      ? "#0f172a"
                      : "#ffffff",
                    borderColor: darkMode
                      ? "#334155"
                      : "#e2e8f0",
                    color: darkMode
                      ? "#f8fafc"
                      : "#0f172a",
                  }}
                />

                <Bar
                  dataKey="bookings"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Status + Workload */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Status Distribution */}
        <div
          className={`rounded-xl border p-5 shadow-sm ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mb-4">
            <h2
              className={`font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              Booking Status
            </h2>

            <p
              className={`text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Current booking distribution
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusDistribution.map(
                    (_, index) => (
                      <Cell
                        key={`cell-${index}`}
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode
                      ? "#0f172a"
                      : "#ffffff",
                    borderColor: darkMode
                      ? "#334155"
                      : "#e2e8f0",
                    color: darkMode
                      ? "#f8fafc"
                      : "#0f172a",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    color: darkMode
                      ? "#cbd5e1"
                      : "#475569",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mechanic Workload */}
        <div
          className={`rounded-xl border p-5 shadow-sm ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mb-4">
            <h2
              className={`font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              Mechanic Workload
            </h2>

            <p
              className={`text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Assigned vs completed jobs
            </p>
          </div>

          <div className="space-y-4">
            {mechanicWorkload
              .slice(0, 6)
              .map((mechanic) => (
                <div
                  key={mechanic.id}
                  className="space-y-2"
                >
                  <div className="flex justify-between">

                    <span
                      className={`text-sm font-medium ${
                        darkMode
                          ? "text-slate-200"
                          : "text-slate-700"
                      }`}
                    >
                      {mechanic.mechanic}
                    </span>

                    <span
                      className={`text-xs ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {mechanic.completedJobs}/
                      {mechanic.assignedJobs}
                    </span>

                  </div>

                  <div
                    className={`h-2 overflow-hidden rounded-full ${
                      darkMode
                        ? "bg-slate-700"
                        : "bg-slate-200"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width:
                          mechanic.assignedJobs === 0
                            ? "0%"
                            : `${Math.min(
                                (mechanic.completedJobs /
                                  mechanic.assignedJobs) *
                                  100,
                                100
                              )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings */}
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
            Recent Bookings
          </h2>

          <p
            className={`text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Latest service bookings
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead
              className={`text-xs uppercase ${
                darkMode
                  ? "bg-slate-800 text-slate-400"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              <tr>
                <th className="px-5 py-3">
                  Customer
                </th>

                <th className="px-5 py-3">
                  Vehicle
                </th>

                <th className="px-5 py-3">
                  Service
                </th>

                <th className="px-5 py-3">
                  Mechanic
                </th>

                <th className="px-5 py-3">
                  Status
                </th>

                <th className="px-5 py-3">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map(
                (booking) => (
                  <tr
                    key={booking.id}
                    className={`border-t ${
                      darkMode
                        ? "border-slate-800"
                        : "border-slate-100"
                    }`}
                  >
                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode
                          ? "text-slate-200"
                          : "text-slate-800"
                      }`}
                    >
                      {booking.customer}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {booking.vehicle}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {booking.service}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {booking.mechanic ||
                        "Unassigned"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          darkMode
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode
                          ? "text-slate-200"
                          : "text-slate-800"
                      }`}
                    >
                      ₹
                      {booking.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;