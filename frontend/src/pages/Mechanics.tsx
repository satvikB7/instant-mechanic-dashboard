import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Mechanic {
  id: number;
  name: string;
  phone: string;
  status: string;
  specialization: string;
  jobsCompleted: number;
  createdAt: string;
}

interface MechanicsProps {
  darkMode: boolean;
}

function Mechanics({ darkMode }: MechanicsProps) {
  const navigate = useNavigate();

  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMechanics() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/mechanics", {
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

        setMechanics(response.data.data);
        setTotal(response.data.pagination.total);
        setTotalPages(
          response.data.pagination.totalPages
        );
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError("Failed to load mechanics");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMechanics();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    limit,
    search,
    status,
    sortBy,
    sortOrder,
  ]);

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
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        dateStyle: "medium",
      }
    );
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "AVAILABLE":
        return darkMode
          ? "bg-green-950 text-green-400"
          : "bg-green-100 text-green-700";

      case "BUSY":
        return darkMode
          ? "bg-yellow-950 text-yellow-400"
          : "bg-yellow-100 text-yellow-700";

      case "OFFLINE":
        return darkMode
          ? "bg-slate-800 text-slate-400"
          : "bg-slate-100 text-slate-600";

      default:
        return darkMode
          ? "bg-slate-800 text-slate-400"
          : "bg-slate-100 text-slate-600";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode
              ? "text-white"
              : "text-slate-900"
          }`}
        >
          Mechanics
        </h1>

        <p
          className={`mt-1 text-sm ${
            darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          Manage mechanics and monitor their workload.
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
            placeholder="Search mechanics..."
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
            <option value="AVAILABLE">
              Available
            </option>
            <option value="BUSY">Busy</option>
            <option value="OFFLINE">Offline</option>
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
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Loading mechanics...
          </div>
        ) : mechanics.length === 0 ? (
          <div
            className={`p-10 text-center text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            No mechanics found.
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
                  <th
                    className={`cursor-pointer px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                    onClick={() =>
                      handleSort("name")
                    }
                  >
                    Mechanic
                    {sortBy === "name" &&
                      (sortOrder === "asc"
                        ? " ↑"
                        : " ↓")}
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Phone
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Specialization
                  </th>

                  <th
                    className={`cursor-pointer px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                    onClick={() =>
                      handleSort("status")
                    }
                  >
                    Status
                    {sortBy === "status" &&
                      (sortOrder === "asc"
                        ? " ↑"
                        : " ↓")}
                  </th>

                  <th
                    className={`cursor-pointer px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                    onClick={() =>
                      handleSort("completedJobs")
                    }
                  >
                    Jobs Completed
                    {sortBy ===
                      "completedJobs" &&
                      (sortOrder === "asc"
                        ? " ↑"
                        : " ↓")}
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {mechanics.map((mechanic) => (
                  <tr
                    key={mechanic.id}
                    onClick={() =>
                      navigate(
                        `/mechanics/${mechanic.id}`
                      )
                    }
                    className={`cursor-pointer border-b last:border-0 transition-colors ${
                      darkMode
                        ? "border-slate-800 hover:bg-slate-800"
                        : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div
                        className={`font-medium ${
                          darkMode
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                      >
                        {mechanic.name}
                      </div>

                      <div
                        className={`text-xs ${
                          darkMode
                            ? "text-slate-500"
                            : "text-slate-500"
                        }`}
                      >
                        ID #{mechanic.id}
                      </div>
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {mechanic.phone}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {mechanic.specialization}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          mechanic.status
                        )}`}
                      >
                        {mechanic.status}
                      </span>
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode
                          ? "text-slate-200"
                          : "text-slate-800"
                      }`}
                    >
                      {mechanic.jobsCompleted}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {formatDate(
                        mechanic.createdAt
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
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Showing{" "}
            {(page - 1) * limit + 1} -{" "}
            {Math.min(page * limit, total)} of{" "}
            {total}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (previous) => previous - 1
                )
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
                darkMode
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage(
                  (previous) => previous + 1
                )
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

export default Mechanics;