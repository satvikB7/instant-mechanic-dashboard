import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getCustomers(
  req: Request,
  res: Response
) {
  try {
    // --------------------------------
    // Query parameters
    // --------------------------------

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      100
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const sortBy =
      typeof req.query.sortBy === "string"
        ? req.query.sortBy
        : "name";

    const sortOrder =
      req.query.sortOrder === "desc"
        ? "DESC"
        : "ASC";

    const offset = (page - 1) * limit;

    // --------------------------------
    // Allowed sorting columns
    // --------------------------------

    const sortColumns: Record<string, string> = {
      id: "c.id",
      name: "c.name",
      email: "c.email",
      phone: "c.phone",
      bookings: "booking_count",
      spending: "total_spending",
      vehicles: "vehicle_count",
      createdAt: "c.created_at",
    };

    const orderColumn =
      sortColumns[sortBy] || "c.name";

    // --------------------------------
    // WHERE conditions
    // --------------------------------

    const conditions: string[] = [];
    const values: unknown[] = [];

    let parameterIndex = 1;

    // Search
    if (search) {
      conditions.push(`
        (
          c.name ILIKE $${parameterIndex}
          OR c.email ILIKE $${parameterIndex}
          OR c.phone ILIKE $${parameterIndex}
        )
      `);

      values.push(`%${search}%`);
      parameterIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // --------------------------------
    // Count customers
    // --------------------------------

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM customers c
      ${whereClause}
    `;

    const countResult = await pool.query(
      countQuery,
      values
    );

    const total = Number(
      countResult.rows[0].total
    );

    // --------------------------------
    // Customers query
    // --------------------------------

    const customersQuery = `
      SELECT
        c.id,
        c.name,
        c.email,
        c.phone,
        c.created_at,

        COUNT(DISTINCT b.id) AS booking_count,

        COALESCE(
          SUM(
            CASE
              WHEN b.status = 'COMPLETED'
              THEN b.amount
              ELSE 0
            END
          ),
          0
        ) AS total_spending,

        COUNT(DISTINCT v.id) AS vehicle_count

      FROM customers c

      LEFT JOIN bookings b
        ON c.id = b.customer_id

      LEFT JOIN vehicles v
        ON c.id = v.customer_id

      ${whereClause}

      GROUP BY
        c.id,
        c.name,
        c.email,
        c.phone,
        c.created_at

      ORDER BY ${orderColumn} ${sortOrder}

      LIMIT $${parameterIndex}
      OFFSET $${parameterIndex + 1}
    `;

    const customersResult =
      await pool.query(
        customersQuery,
        [
          ...values,
          limit,
          offset,
        ]
      );

    // --------------------------------
    // Response
    // --------------------------------

    res.json({
      data: customersResult.rows.map(
        (customer) => ({
          id: customer.id,

          name: customer.name,

          email: customer.email,

          phone: customer.phone,

          bookings: Number(
            customer.booking_count
          ),

          spending: Number(
            customer.total_spending
          ),

          vehicles: Number(
            customer.vehicle_count
          ),

          createdAt:
            customer.created_at,
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
      "Customers error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load customers",
    });
  }
}