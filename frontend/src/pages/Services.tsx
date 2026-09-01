import { useEffect, useState } from "react";
import api from "../services/api";

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  basePrice: number;
}

interface ServicesProps {
  darkMode: boolean;
}

function Services({ darkMode }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/services", {
          params: {
            page,
            limit,
            search,
          },
        });

        if (cancelled) return;

        setServices(response.data.data);

        setTotal(response.data.pagination.total);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError("Failed to load services");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      cancelled = true;
    };
  }, [page, limit, search]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleLimit(value: number) {
    setLimit(value);
    setPage(1);
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Services
        </h1>

        <p
          className={`mt-1 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Manage and monitor available mechanic services.
        </p>
      </div>

      {/* Filters */}
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
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search services..."
            className={`flex-1 rounded-lg border px-4 py-2 text-sm outline-none ${
              darkMode
                ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-slate-500"
                : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-500"
            }`}
          />

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

        </div>
      </div>

      {/* Error */}
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

      {/* Table */}
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
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div
            className={`p-10 text-center text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            No services found.
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

                  {["ID", "Service", "Category", "Description", "Base Price"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className={`px-5 py-4 font-semibold ${
                          darkMode
                            ? "text-slate-200"
                            : "text-slate-700"
                        }`}
                      >
                        {heading}
                      </th>
                    )
                  )}

                </tr>
              </thead>

              <tbody>

                {services.map((service) => (
                  <tr
                    key={service.id}
                    className={`border-b last:border-0 ${
                      darkMode
                        ? "border-slate-800 hover:bg-slate-800"
                        : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >

                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      #{service.id}
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {service.name}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          darkMode
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {service.category}
                      </span>
                    </td>

                    <td
                      className={`max-w-md px-5 py-4 ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {service.description || "—"}
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode ? "text-slate-200" : "text-slate-800"
                      }`}
                    >
                      {formatCurrency(service.basePrice)}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Pagination */}
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
            {Math.min(page * limit, total)}{" "}
            of {total}
          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((previous) => previous - 1)
              }
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
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((previous) => previous + 1)
              }
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

export default Services;