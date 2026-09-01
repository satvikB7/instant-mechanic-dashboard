import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Vehicles from "./pages/Vehicles";
import Mechanics from "./pages/Mechanics";
import MechanicDetails from "./pages/MechanicDetails";
import Services from "./pages/Services";
import Settings from "./pages/Settings";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              darkMode={darkMode}
            />
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="*"
            element={
              <div
                className={
                  darkMode
                    ? "min-h-screen bg-slate-950 text-slate-100"
                    : "min-h-screen bg-slate-100 text-slate-900"
                }
              >
                <Sidebar
                  darkMode={darkMode}
                />

                <Navbar
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />

                <main
                  className={
                    darkMode
                      ? "ml-64 min-h-screen bg-slate-950 pt-16"
                      : "ml-64 min-h-screen bg-slate-100 pt-16"
                  }
                >
                  <div className="p-6">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <Dashboard
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/bookings"
                        element={
                          <Bookings
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/bookings/:id"
                        element={
                          <BookingDetails
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/customers"
                        element={
                          <Customers
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/customers/:id"
                        element={
                          <CustomerDetails
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/vehicles"
                        element={
                          <Vehicles
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/mechanics"
                        element={
                          <Mechanics
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/mechanics/:id"
                        element={
                          <MechanicDetails
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/services"
                        element={
                          <Services
                            darkMode={darkMode}
                          />
                        }
                      />

                      <Route
                        path="/settings"
                        element={
                          <Settings
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                          />
                        }
                      />
                    </Routes>
                  </div>
                </main>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;