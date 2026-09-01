import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AxiosError } from "axios";
import api from "../services/api";

interface Booking {
  id: number;
  status: string;
  amount: number;
  scheduledAt: string;
  createdAt: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
}

interface Service {
  id: number;
  name: string;
}

interface Mechanic {
  id: number;
  name: string;
}

interface BookingDetailsData {
  booking: Booking;
  customer: Customer;
  vehicle: Vehicle;
  service: Service;
  mechanic: Mechanic | null;
}

interface BookingDetailsProps {
  darkMode: boolean;
}

function BookingDetails({
  darkMode,
}: BookingDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] =
    useState<BookingDetailsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/bookings/${id}`
        );

        setData(response.data);
      } catch (error: unknown) {
        console.error(
          "Booking details error:",
          error
        );

        if (error instanceof AxiosError) {
          setError(
            error.response?.data?.message ||
              "Failed to load booking details"
          );
        } else {
          setError(
            "Failed to load booking details"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const formatDate = (
    date: string
  ) => {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const formatCurrency = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount);
  };

  const formatStatus = (
    status: string
  ) => {
    return status.replaceAll("_", " ");
  };

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "COMPLETED":
        return darkMode
          ? "bg-green-900/40 text-green-300"
          : "bg-green-100 text-green-700";

      case "CANCELLED":
        return darkMode
          ? "bg-red-900/40 text-red-300"
          : "bg-red-100 text-red-700";

      case "IN_PROGRESS":
        return darkMode
          ? "bg-blue-900/40 text-blue-300"
          : "bg-blue-100 text-blue-700";

      case "MECHANIC_ON_THE_WAY":
        return darkMode
          ? "bg-purple-900/40 text-purple-300"
          : "bg-purple-100 text-purple-700";

      case "ASSIGNED":
        return darkMode
          ? "bg-yellow-900/40 text-yellow-300"
          : "bg-yellow-100 text-yellow-700";

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
          Loading booking details...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <button
          onClick={() =>
            navigate("/bookings")
          }
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            darkMode
              ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
              : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ArrowLeft size={18} />
          Back to Bookings
        </button>

        <div
          className={`rounded-xl border p-6 ${
            darkMode
              ? "border-red-900 bg-red-950/30 text-red-300"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {error || "Booking not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() =>
            navigate("/bookings")
          }
          className={`mb-4 flex items-center gap-2 text-sm font-medium transition ${
            darkMode
              ? "text-slate-300 hover:text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ArrowLeft size={18} />
          Back to Bookings
        </button>

        <h1
          className={`text-2xl font-bold ${
            darkMode
              ? "text-white"
              : "text-slate-900"
          }`}
        >
          Booking Details
        </h1>

        <p
          className={
            darkMode
              ? "mt-1 text-slate-400"
              : "mt-1 text-slate-500"
          }
        >
          View complete information about
          booking #{data.booking.id}.
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
              Booking ID
            </p>

            <h2
              className={`mt-1 text-xl font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              #{data.booking.id}
            </h2>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
              data.booking.status
            )}`}
          >
            {formatStatus(
              data.booking.status
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
            Booking Information
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
                Amount
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {formatCurrency(
                  data.booking.amount
                )}
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
                Scheduled At
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {formatDate(
                  data.booking.scheduledAt
                )}
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
                Created At
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {formatDate(
                  data.booking.createdAt
                )}
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
            Customer
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
                {data.customer.name}
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
                Email
              </p>

              <p
                className={`mt-1 ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}
              >
                {data.customer.email}
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
                {data.customer.phone}
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
            Vehicle
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
                Vehicle
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {data.vehicle.make}{" "}
                {data.vehicle.model}
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
                Year
              </p>

              <p
                className={`mt-1 ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}
              >
                {data.vehicle.year}
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
                Registration Number
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {data.vehicle.registrationNumber}
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
            Service & Mechanic
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
                Service
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {data.service.name}
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
                Mechanic
              </p>

              <p
                className={`mt-1 font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {data.mechanic
                  ? data.mechanic.name
                  : "Not assigned"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;