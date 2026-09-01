import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  CalendarDays,
  Mail,
  Phone,
  UserCircle,
  IndianRupee,
} from "lucide-react";
import axios from "axios";
import api from "../services/api";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  bookings: number;
  spending: number;
  vehicles: number;
  createdAt: string;
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number | null;
  registrationNumber: string;
}

interface Booking {
  id: number;
  vehicle: string;
  service: string;
  mechanic: string | null;
  status: string;
  amount: number;
  scheduledAt: string;
  createdAt: string;
}

interface CustomerDetailsResponse {
  customer: Customer;
  vehicles: Vehicle[];
  bookings: Booking[];
}

interface CustomerDetailsProps {
  darkMode: boolean;
}

interface ErrorResponse {
  message?: string;
}

function CustomerDetails({
  darkMode,
}: CustomerDetailsProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCustomerDetails() {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<CustomerDetailsResponse>(
            `/customers/${id}`
          );

        if (cancelled) return;

        setCustomer(response.data.customer);
        setVehicles(response.data.vehicles);
        setBookings(response.data.bookings);
      } catch (err: unknown) {
        if (cancelled) return;

        console.error(err);

        if (
          axios.isAxiosError<ErrorResponse>(err)
        ) {
          setError(
            err.response?.data?.message ||
              "Failed to load customer details."
          );
        } else {
          setError(
            "Failed to load customer details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadCustomerDetails();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        dateStyle: "medium",
      }
    );
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "COMPLETED":
        return darkMode
          ? "bg-green-950 text-green-400"
          : "bg-green-50 text-green-700";

      case "CANCELLED":
        return darkMode
          ? "bg-red-950 text-red-400"
          : "bg-red-50 text-red-700";

      case "IN_PROGRESS":
        return darkMode
          ? "bg-blue-950 text-blue-400"
          : "bg-blue-50 text-blue-700";

      case "ASSIGNED":
        return darkMode
          ? "bg-purple-950 text-purple-400"
          : "bg-purple-50 text-purple-700";

      case "MECHANIC_ON_THE_WAY":
        return darkMode
          ? "bg-orange-950 text-orange-400"
          : "bg-orange-50 text-orange-700";

      case "PENDING":
        return darkMode
          ? "bg-yellow-950 text-yellow-400"
          : "bg-yellow-50 text-yellow-700";

      default:
        return darkMode
          ? "bg-slate-800 text-slate-300"
          : "bg-slate-100 text-slate-600";
    }
  }

  const cardClass = darkMode
    ? "border-slate-700 bg-slate-900"
    : "border-slate-200 bg-white";

  const headingClass = darkMode
    ? "text-white"
    : "text-slate-900";

  const mutedClass = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  if (loading) {
    return (
      <div
        className={`rounded-xl border p-10 text-center text-sm ${cardClass} ${mutedClass}`}
      >
        Loading customer details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/customers")}
          className={`flex items-center gap-2 text-sm ${
            darkMode
              ? "text-slate-300 hover:text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ArrowLeft size={18} />
          Back to Customers
        </button>

        <div
          className={`rounded-xl border p-5 text-sm ${
            darkMode
              ? "border-red-900 bg-red-950 text-red-400"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {error}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div
        className={`rounded-xl border p-10 text-center text-sm ${cardClass} ${mutedClass}`}
      >
        Customer not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/customers")}
        className={`flex items-center gap-2 text-sm font-medium ${
          darkMode
            ? "text-slate-300 hover:text-white"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <ArrowLeft size={18} />
        Back to Customers
      </button>

      {/* Header */}
      <div
        className={`rounded-xl border p-6 shadow-sm ${cardClass}`}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center">

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              darkMode
                ? "bg-slate-800"
                : "bg-slate-100"
            }`}
          >
            <UserCircle
              size={40}
              className={
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }
            />
          </div>

          <div>
            <h1
              className={`text-2xl font-bold ${headingClass}`}
            >
              {customer.name}
            </h1>

            <p className={`mt-1 text-sm ${mutedClass}`}>
              Customer ID #{customer.id}
            </p>

            <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:gap-5">

              <span
                className={`flex items-center gap-2 ${mutedClass}`}
              >
                <Mail size={16} />
                {customer.email}
              </span>

              <span
                className={`flex items-center gap-2 ${mutedClass}`}
              >
                <Phone size={16} />
                {customer.phone}
              </span>

            </div>
          </div>

        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div
          className={`rounded-xl border p-5 shadow-sm ${cardClass}`}
        >
          <div className="flex items-center justify-between">

            <div>
              <p className={`text-sm ${mutedClass}`}>
                Total Bookings
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${headingClass}`}
              >
                {customer.bookings}
              </p>
            </div>

            <CalendarDays
              size={24}
              className={
                darkMode
                  ? "text-blue-400"
                  : "text-blue-600"
              }
            />

          </div>
        </div>

        <div
          className={`rounded-xl border p-5 shadow-sm ${cardClass}`}
        >
          <div className="flex items-center justify-between">

            <div>
              <p className={`text-sm ${mutedClass}`}>
                Total Spending
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${headingClass}`}
              >
                {formatCurrency(
                  customer.spending
                )}
              </p>
            </div>

            <IndianRupee
              size={24}
              className={
                darkMode
                  ? "text-green-400"
                  : "text-green-600"
              }
            />

          </div>
        </div>

        <div
          className={`rounded-xl border p-5 shadow-sm ${cardClass}`}
        >
          <div className="flex items-center justify-between">

            <div>
              <p className={`text-sm ${mutedClass}`}>
                Vehicles
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${headingClass}`}
              >
                {customer.vehicles}
              </p>
            </div>

            <Car
              size={24}
              className={
                darkMode
                  ? "text-purple-400"
                  : "text-purple-600"
              }
            />

          </div>
        </div>

      </div>

      {/* Customer Information */}
      <div
        className={`rounded-xl border p-6 shadow-sm ${cardClass}`}
      >
        <h2
          className={`text-lg font-semibold ${headingClass}`}
        >
          Customer Information
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div>
            <p className={`text-xs ${mutedClass}`}>
              Name
            </p>

            <p
              className={`mt-1 text-sm font-medium ${headingClass}`}
            >
              {customer.name}
            </p>
          </div>

          <div>
            <p className={`text-xs ${mutedClass}`}>
              Email
            </p>

            <p
              className={`mt-1 text-sm font-medium ${headingClass}`}
            >
              {customer.email}
            </p>
          </div>

          <div>
            <p className={`text-xs ${mutedClass}`}>
              Phone
            </p>

            <p
              className={`mt-1 text-sm font-medium ${headingClass}`}
            >
              {customer.phone}
            </p>
          </div>

          <div>
            <p className={`text-xs ${mutedClass}`}>
              Joined
            </p>

            <p
              className={`mt-1 text-sm font-medium ${headingClass}`}
            >
              {formatDate(customer.createdAt)}
            </p>
          </div>

        </div>
      </div>

      {/* Vehicles */}
      <div
        className={`rounded-xl border shadow-sm ${cardClass}`}
      >
        <div className="border-b border-inherit px-6 py-4">
          <h2
            className={`text-lg font-semibold ${headingClass}`}
          >
            Vehicles
          </h2>
        </div>

        {vehicles.length === 0 ? (
          <div
            className={`p-8 text-center text-sm ${mutedClass}`}
          >
            No vehicles found for this customer.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead
                className={
                  darkMode
                    ? "bg-slate-800"
                    : "bg-slate-50"
                }
              >
                <tr>
                  <th
                    className={`px-6 py-4 font-semibold ${headingClass}`}
                  >
                    Vehicle
                  </th>

                  <th
                    className={`px-6 py-4 font-semibold ${headingClass}`}
                  >
                    Year
                  </th>

                  <th
                    className={`px-6 py-4 font-semibold ${headingClass}`}
                  >
                    Registration
                  </th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className={`border-t ${
                      darkMode
                        ? "border-slate-800"
                        : "border-slate-100"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 font-medium ${headingClass}`}
                    >
                      {vehicle.make} {vehicle.model}
                    </td>

                    <td
                      className={`px-6 py-4 ${mutedClass}`}
                    >
                      {vehicle.year || "—"}
                    </td>

                    <td
                      className={`px-6 py-4 ${mutedClass}`}
                    >
                      {vehicle.registrationNumber}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

      {/* Booking History */}
      <div
        className={`rounded-xl border shadow-sm ${cardClass}`}
      >
        <div className="border-b border-inherit px-6 py-4">
          <h2
            className={`text-lg font-semibold ${headingClass}`}
          >
            Booking History
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div
            className={`p-8 text-center text-sm ${mutedClass}`}
          >
            No bookings found for this customer.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead
                className={
                  darkMode
                    ? "bg-slate-800"
                    : "bg-slate-50"
                }
              >
                <tr>

                  <th
                    className={`px-5 py-4 font-semibold ${headingClass}`}
                  >
                    Booking
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${headingClass}`}
                  >
                    Vehicle
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${headingClass}`}
                  >
                    Service
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${headingClass}`}
                  >
                    Mechanic
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${headingClass}`}
                  >
                    Status
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${headingClass}`}
                  >
                    Amount
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${headingClass}`}
                  >
                    Scheduled
                  </th>

                </tr>
              </thead>

              <tbody>

                {bookings.map((booking) => (

                  <tr
                    key={booking.id}
                    className={`border-t ${
                      darkMode
                        ? "border-slate-800 hover:bg-slate-800"
                        : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >

                    <td
                      className={`px-5 py-4 font-medium ${headingClass}`}
                    >
                      #{booking.id}
                    </td>

                    <td
                      className={`px-5 py-4 ${mutedClass}`}
                    >
                      {booking.vehicle}
                    </td>

                    <td
                      className={`px-5 py-4 ${mutedClass}`}
                    >
                      {booking.service}
                    </td>

                    <td
                      className={`px-5 py-4 ${mutedClass}`}
                    >
                      {booking.mechanic || "Unassigned"}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status.replaceAll(
                          "_",
                          " "
                        )}
                      </span>

                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${headingClass}`}
                    >
                      {formatCurrency(
                        booking.amount
                      )}
                    </td>

                    <td
                      className={`px-5 py-4 ${mutedClass}`}
                    >
                      {formatDateTime(
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

    </div>
  );
}

export default CustomerDetails;