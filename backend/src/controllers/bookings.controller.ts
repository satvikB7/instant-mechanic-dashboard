import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getBookings(
  req: Request,
  res: Response
) {
  try {
    // -----------------------------
    // Query parameters
    // -----------------------------

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      1000
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const service =
      typeof req.query.service === "string"
        ? req.query.service
        : "";

    const startDate =
      typeof req.query.startDate === "string"
        ? req.query.startDate
        : "";

    const endDate =
      typeof req.query.endDate === "string"
        ? req.query.endDate
        : "";

    const sortBy =
      typeof req.query.sortBy === "string"
        ? req.query.sortBy
        : "scheduled_at";

    const sortOrder =
      req.query.sortOrder === "asc"
        ? "ASC"
        : "DESC";

    const offset = (page - 1) * limit;

    // -----------------------------
    // Allowed sorting columns
    // -----------------------------

    const sortColumns: Record<string, string> = {
      id: "b.id",
      customer: "c.name",
      service: "s.name",
      status: "b.status",
      amount: "b.amount",
      scheduledAt: "b.scheduled_at",
      createdAt: "b.created_at",
    };

    const orderColumn =
      sortColumns[sortBy] || "b.scheduled_at";

    // -----------------------------
    // Build WHERE conditions
    // -----------------------------

    const conditions: string[] = [];
    const values: unknown[] = [];

    let parameterIndex = 1;

    // Search
    if (search) {
      conditions.push(`
        (
          c.name ILIKE $${parameterIndex}
          OR c.email ILIKE $${parameterIndex}
          OR v.make ILIKE $${parameterIndex}
          OR v.model ILIKE $${parameterIndex}
          OR s.name ILIKE $${parameterIndex}
        )
      `);

      values.push(`%${search}%`);
      parameterIndex++;
    }

    // Status filter
    if (status) {
      conditions.push(
        `b.status = $${parameterIndex}`
      );

      values.push(status);
      parameterIndex++;
    }

    // Service filter
    if (service) {
      conditions.push(
        `s.name = $${parameterIndex}`
      );

      values.push(service);
      parameterIndex++;
    }

    // Start date
    if (startDate) {
      conditions.push(
        `b.scheduled_at >= $${parameterIndex}`
      );

      values.push(startDate);
      parameterIndex++;
    }

    // End date
    if (endDate) {
      conditions.push(
        `b.scheduled_at < ($${parameterIndex}::date + INTERVAL '1 day')`
      );

      values.push(endDate);
      parameterIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // -----------------------------
    // Total count
    // -----------------------------

    const countQuery = `
      SELECT COUNT(*) AS total

      FROM bookings b

      JOIN customers c
        ON b.customer_id = c.id

      JOIN vehicles v
        ON b.vehicle_id = v.id

      JOIN services s
        ON b.service_id = s.id

      ${whereClause}
    `;

    const countResult = await pool.query(
      countQuery,
      values
    );

    const total = Number(
      countResult.rows[0].total
    );

    // -----------------------------
    // Bookings query
    // -----------------------------

    const bookingsQuery = `
      SELECT
        b.id,

        c.name AS customer,
        c.email AS customer_email,

        v.make AS vehicle_make,
        v.model AS vehicle_model,

        s.name AS service,

        m.name AS mechanic,

        b.status,
        b.amount,
        b.scheduled_at,
        b.created_at

      FROM bookings b

      JOIN customers c
        ON b.customer_id = c.id

      JOIN vehicles v
        ON b.vehicle_id = v.id

      JOIN services s
        ON b.service_id = s.id

      LEFT JOIN mechanics m
        ON b.mechanic_id = m.id

      ${whereClause}

      ORDER BY ${orderColumn} ${sortOrder}

      LIMIT $${parameterIndex}
      OFFSET $${parameterIndex + 1}
    `;

    const bookingValues = [
      ...values,
      limit,
      offset,
    ];

    const bookingsResult = await pool.query(
      bookingsQuery,
      bookingValues
    );

    // -----------------------------
    // Response
    // -----------------------------

    res.json({
      data: bookingsResult.rows.map(
        (booking) => ({
          id: booking.id,

          customer: booking.customer,

          customerEmail:
            booking.customer_email,

          vehicle: `${booking.vehicle_make} ${booking.vehicle_model}`,

          service: booking.service,

          mechanic:
            booking.mechanic || null,

          status: booking.status,

          amount: Number(
            booking.amount
          ),

          scheduledAt:
            booking.scheduled_at,

          createdAt:
            booking.created_at,
        })
      ),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    });

  } catch (error) {
    console.error(
      "Bookings error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load bookings",
    });
  }
}