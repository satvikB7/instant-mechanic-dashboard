import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import api from "../services/api";

interface Booking {
  id: number;
  customer: string;
  customerEmail: string;
  vehicle: string;
  service: string;
  mechanic: string | null;
  status: string;
  amount: number;
  scheduledAt: string;
  createdAt: string;
}

interface BookingsProps {
  darkMode: boolean;
}

function Bookings({ darkMode }: BookingsProps) {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [sortBy, setSortBy] = useState("scheduledAt");
  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("desc");

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/bookings", {
          params: {
            page,
            limit,
            search,
            status,
            sortBy,
            sortOrder,
          },
        });

        if (cancelled) return;

        setBookings(response.data.data);
        setTotal(response.data.pagination.total);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError("Failed to load bookings");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [page, limit, search, status, sortBy, sortOrder]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handleLimit(value: number) {
    setLimit(value);
    setPage(1);
  }

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }

    setPage(1);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function escapeCsvValue(value: string | number | null) {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  async function exportToCsv() {
    try {
      setExporting(true);
      setError("");

      const response = await api.get("/bookings", {
        params: {
          page: 1,
          limit: 100000,
          search,
          status,
          sortBy,
          sortOrder,
        },
      });

      const allBookings: Booking[] = response.data.data;

      if (allBookings.length === 0) {
        setError("No bookings available to export.");
        return;
      }

      const headers = [
        "ID",
        "Customer",
        "Customer Email",
        "Vehicle",
        "Service",
        "Mechanic",
        "Status",
        "Amount",
        "Scheduled At",
        "Created At",
      ];

      const rows = allBookings.map((booking) => [
        booking.id,
        booking.customer,
        booking.customerEmail,
        booking.vehicle,
        booking.service,
        booking.mechanic ?? "Unassigned",
        booking.status.replaceAll("_", " "),
        booking.amount,
        formatDate(booking.scheduledAt),
        formatDate(booking.createdAt),
      ]);

      const csvContent = [
        headers.map(escapeCsvValue).join(","),
        ...rows.map((row) =>
          row.map(escapeCsvValue).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "bookings.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to export bookings.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Bookings
        </h1>

        <p
          className={`mt-1 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Manage and monitor all service bookings.
        </p>
      </div>

      <div
        className={`rounded-xl border p-4 shadow-sm ${
          darkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            placeholder="Search bookings..."
            className={`flex-1 rounded-lg border px-4 py-2 text-sm outline-none ${
              darkMode
                ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-slate-500"
                : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-500"
            }`}
          />

          <select
            value={status}
            onChange={(e) =>
              handleStatus(e.target.value)
            }
            className={`rounded-lg border px-4 py-2 text-sm outline-none ${
              darkMode
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-slate-300 bg-white text-slate-900"
            }`}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="MECHANIC_ON_THE_WAY">
              Mechanic On The Way
            </option>
            <option value="IN_PROGRESS">
              In Progress
            </option>
            <option value="COMPLETED">
              Completed
            </option>
            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <select
            value={limit}
            onChange={(e) =>
              handleLimit(Number(e.target.value))
            }
            className={`rounded-lg border px-4 py-2 text-sm outline-none ${
              darkMode
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-slate-300 bg-white text-slate-900"
            }`}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <button
            type="button"
            onClick={exportToCsv}
            disabled={loading || exporting}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Download size={16} />

            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            darkMode
              ? "border-red-900 bg-red-950 text-red-400"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {error}
        </div>
      )}

      <div
        className={`overflow-hidden rounded-xl border shadow-sm ${
          darkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        {loading ? (
          <div
            className={`p-10 text-center text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div
            className={`p-10 text-center text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            No bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`border-b ${
                  darkMode
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <tr>
                  {[
                    ["ID", null],
                    ["Customer", null],
                    ["Vehicle", null],
                    ["Service", null],
                    ["Mechanic", null],
                    ["Status", null],
                    ["Amount", "amount"],
                    ["Scheduled", "scheduledAt"],
                  ].map(([heading, column]) => (
                    <th
                      key={heading}
                      className={`px-5 py-4 font-semibold ${
                        darkMode
                          ? "text-slate-200"
                          : "text-slate-700"
                      } ${
                        column
                          ? "cursor-pointer"
                          : ""
                      }`}
                      onClick={() =>
                        column &&
                        handleSort(column)
                      }
                    >
                      {heading}

                      {column &&
                        sortBy === column &&
                        (sortOrder === "asc"
                          ? " ↑"
                          : " ↓")}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    onClick={() =>
                      navigate(
                        `/bookings/${booking.id}`
                      )
                    }
                    className={`cursor-pointer border-b last:border-0 transition-colors ${
                      darkMode
                        ? "border-slate-800 hover:bg-slate-800"
                        : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode
                          ? "text-slate-200"
                          : "text-slate-700"
                      }`}
                    >
                      #{booking.id}
                    </td>

                    <td className="px-5 py-4">
                      <div
                        className={`font-medium ${
                          darkMode
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                      >
                        {booking.customer}
                      </div>

                      <div className="text-xs text-slate-500">
                        {booking.customerEmail}
                      </div>
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {booking.vehicle}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {booking.service}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {booking.mechanic || "Unassigned"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          darkMode
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {booking.status.replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode
                          ? "text-slate-200"
                          : "text-slate-800"
                      }`}
                    >
                      {formatCurrency(booking.amount)}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {formatDate(
                        booking.scheduledAt
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && totalPages > 0 && (
        <div
          className={`flex items-center justify-between rounded-xl border px-5 py-4 shadow-sm ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Showing{" "}
            {(page - 1) * limit + 1}{" "}
            -{" "}
            {Math.min(
              page * limit,
              total
            )}{" "}
            of {total}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={(e) => {
                e.stopPropagation();
                setPage(
                  (previous) =>
                    previous - 1
                );
              }}
              className={`rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Previous
            </button>

            <span
              className={`px-3 text-sm ${
                darkMode
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={(e) => {
                e.stopPropagation();
                setPage(
                  (previous) =>
                    previous + 1
                );
              }}
              className={`rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;