import express from "express";
import cors from "cors";

import dashboardRoutes from "./routes/dashboard.routes";
import bookingsRoutes from "./routes/bookings.routes";
import mechanicsRoutes from "./routes/mechanics.routes";
import servicesRoutes from "./routes/services.routes";
import customersRoutes from "./routes/customers.routes";
import vehiclesRoutes from "./routes/vehicles.routes";
import authRoutes from "./routes/auth.routes";

import { authenticateToken } from "./middleware/authMiddleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Instant Mechanic API is running",
  });
});

// --------------------------------
// Authentication
// --------------------------------
// Login remains public so users can
// obtain a JWT token.
// --------------------------------

app.use(
  "/api/auth",
  authRoutes
);

// --------------------------------
// Protected routes
// --------------------------------

app.use(
  "/api/dashboard",
  authenticateToken,
  dashboardRoutes
);

app.use(
  "/api/bookings",
  authenticateToken,
  bookingsRoutes
);

app.use(
  "/api/mechanics",
  authenticateToken,
  mechanicsRoutes
);

app.use(
  "/api/services",
  authenticateToken,
  servicesRoutes
);

app.use(
  "/api/customers",
  authenticateToken,
  customersRoutes
);

app.use(
  "/api/vehicles",
  authenticateToken,
  vehiclesRoutes
);

export default app;