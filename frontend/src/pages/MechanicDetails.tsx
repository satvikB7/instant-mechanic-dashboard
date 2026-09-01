import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AxiosError } from "axios";
import api from "../services/api";

interface Mechanic {
  id: number;
  name: string;
  phone: string;
  specialization: string;
  status: string;
  createdAt: string;
}

interface Booking {
  id: number;
  status: string;
  amount: number;
  scheduledAt: string;
  customer: string;
  vehicle: string;
  registrationNumber: string;
  service: string;
}

interface MechanicDetailsData {
  mechanic: Mechanic;
  bookings: Booking[];
}

interface MechanicDetailsProps {
  darkMode: boolean;
}

function MechanicDetails({
  darkMode,
}: MechanicDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] =
    useState<MechanicDetailsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchMechanicDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/mechanics/${id}`
        );

        setData(response.data);
      } catch (error: unknown) {
        console.error(
          "Mechanic details error:",
          error
        );

        if (error instanceof AxiosError) {
          setError(
            error.response?.data?.message ||
              "Failed to load mechanic details"
          );
        } else {
          setError(
            "Failed to load mechanic details"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMechanicDetails();
    }
  }, [id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount);
  };

  const formatStatus = (status: string) => {
    return status.replaceAll("_", " ");
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return darkMode
          ? "bg-green-900/40 text-green-300"
          : "bg-green-100 text-green-700";

      case "BUSY":
        return darkMode
          ? "bg-yellow-900/40 text-yellow-300"
          : "bg-yellow-100 text-yellow-700";

      case "OFFLINE":
        return darkMode
          ? "bg-slate-700 text-slate-300"
          : "bg-slate-100 text-slate-700";

      default:
        return darkMode
          ? "bg-slate-700 text-slate-300"
          : "bg-slate-100 text-slate-700";
    }
  };

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
          Loading mechanic details...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <button
          onClick={() =>
            navigate("/mechanics")
          }
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            darkMode
              ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
              : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ArrowLeft size={18} />
          Back to Mechanics
        </button>

        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "border-red-900 bg-red-950/30 text-red-300"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {error || "Mechanic not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() =>
            navigate("/mechanics")
          }
          className={`mb-4 flex items-center gap-2 text-sm font-medium transition ${
            darkMode
              ? "text-slate-300 hover:text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ArrowLeft size={18} />
          Back to Mechanics
        </button>

        <h1
          className={`text-2xl font-bold ${
            darkMode
              ? "text-white"
              : "text-slate-900"
          }`}
        >
          Mechanic Details
        </h1>

        <p
          className={
            darkMode
              ? "mt-1 text-slate-400"
              : "mt-1 text-slate-500"
          }
        >
          View complete information about{" "}
          {data.mechanic.name}.
        </p>
      </div>

      <div
        className={`rounded-xl border p-6 ${
          darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p
              className={`text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Mechanic ID
            </p>

            <h2
              className={`mt-1 text-xl font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              #{data.mechanic.id}
            </h2>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
              data.mechanic.status
            )}`}
          >
            {formatStatus(
              data.mechanic.status
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <h2
            className={`mb-5 text-lg font-semibold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            Personal Information
          </h2>

          <div className="space-y-4">
            <div>
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Name
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {data.mechanic.name}
              </p>
            </div>

            <div>
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Phone
              </p>

              <p
                className={`mt-1 ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}
              >
                {data.mechanic.phone}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <h2
            className={`mb-5 text-lg font-semibold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            Work Information
          </h2>

          <div className="space-y-4">
            <div>
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Specialization
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {data.mechanic.specialization}
              </p>
            </div>

            <div>
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Status
              </p>

              <span
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                  data.mechanic.status
                )}`}
              >
                {formatStatus(
                  data.mechanic.status
                )}
              </span>
            </div>

            <div>
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Joined
              </p>

              <p
                className={`mt-1 ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}
              >
                {formatDate(
                  data.mechanic.createdAt
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl border ${
          darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="p-6">
          <h2
            className={`text-lg font-semibold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            Assigned Bookings
          </h2>

          <p
            className={`mt-1 text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Bookings currently or previously
            assigned to this mechanic.
          </p>
        </div>

        {data.bookings.length === 0 ? (
          <div
            className={`border-t p-8 text-center text-sm ${
              darkMode
                ? "border-slate-800 text-slate-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            No bookings assigned to this
            mechanic.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`border-t border-b ${
                  darkMode
                    ? "border-slate-800 bg-slate-800"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <tr>
                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Booking
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Customer
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Vehicle
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Service
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Status
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Amount
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Scheduled
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.bookings.map(
                  (booking) => (
                    <tr
                      key={booking.id}
                      className={`border-b last:border-0 ${
                        darkMode
                          ? "border-slate-800"
                          : "border-slate-100"
                      }`}
                    >
                      <td
                        className={`px-5 py-4 font-medium ${
                          darkMode
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                      >
                        #{booking.id}
                      </td>

                      <td
                        className={`px-5 py-4 ${
                          darkMode
                            ? "text-slate-300"
                            : "text-slate-700"
                        }`}
                      >
                        {booking.customer}
                      </td>

                      <td
                        className={`px-5 py-4 ${
                          darkMode
                            ? "text-slate-300"
                            : "text-slate-700"
                        }`}
                      >
                        <div>
                          {booking.vehicle}
                        </div>

                        <div className="text-xs text-slate-500">
                          {
                            booking.registrationNumber
                          }
                        </div>
                      </td>

                      <td
                        className={`px-5 py-4 ${
                          darkMode
                            ? "text-slate-300"
                            : "text-slate-700"
                        }`}
                      >
                        {booking.service}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            darkMode
                              ? "bg-slate-800 text-slate-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {formatStatus(
                            booking.status
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
                        {formatCurrency(
                          booking.amount
                        )}
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
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MechanicDetails;