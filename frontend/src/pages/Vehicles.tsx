import { useEffect, useState } from "react";
import api from "../services/api";

interface Vehicle {
  id: number;
  customerId: number;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
}

interface VehiclesProps {
  darkMode: boolean;
}

function Vehicles({ darkMode }: VehiclesProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadVehicles() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/vehicles");

        if (cancelled) return;

        setVehicles(response.data.data);
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError("Failed to load vehicles");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Vehicles
        </h1>

        <p
          className={`mt-1 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Manage customer vehicles.
        </p>
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
            Loading vehicles...
          </div>
        ) : vehicles.length === 0 ? (
          <div
            className={`p-10 text-center text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            No vehicles found.
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
                    className={`px-5 py-4 font-semibold ${
                      darkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    ID
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Customer ID
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Make
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Model
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Year
                  </th>

                  <th
                    className={`px-5 py-4 font-semibold ${
                      darkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Registration
                  </th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
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
                      #{vehicle.id}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      #{vehicle.customerId}
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {vehicle.make}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {vehicle.model}
                    </td>

                    <td
                      className={`px-5 py-4 ${
                        darkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {vehicle.year}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          darkMode
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {vehicle.registrationNumber}
                      </span>
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

export default Vehicles;