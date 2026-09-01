import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getServices(
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

    const category =
      typeof req.query.category === "string"
        ? req.query.category
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
      id: "s.id",
      name: "s.name",
      category: "s.category",
      basePrice: "s.base_price",
      bookings: "booking_count",
      revenue: "total_revenue",
    };

    const orderColumn =
      sortColumns[sortBy] || "s.name";

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
          s.name ILIKE $${parameterIndex}
          OR s.category ILIKE $${parameterIndex}
          OR s.description ILIKE $${parameterIndex}
        )
      `);

      values.push(`%${search}%`);
      parameterIndex++;
    }

    // Category filter
    if (category) {
      conditions.push(
        `s.category = $${parameterIndex}`
      );

      values.push(category);
      parameterIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // --------------------------------
    // Count services
    // --------------------------------

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM services s
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
    // Services query
    // --------------------------------

    const servicesQuery = `
      SELECT
        s.id,
        s.name,
        s.category,
        s.description,
        s.base_price,

        COUNT(b.id) AS booking_count,

        COALESCE(
          SUM(
            CASE
              WHEN b.status = 'COMPLETED'
              THEN b.amount
              ELSE 0
            END
          ),
          0
        ) AS total_revenue

      FROM services s

      LEFT JOIN bookings b
        ON s.id = b.service_id

      ${whereClause}

      GROUP BY
        s.id,
        s.name,
        s.category,
        s.description,
        s.base_price

      ORDER BY ${orderColumn} ${sortOrder}

      LIMIT $${parameterIndex}
      OFFSET $${parameterIndex + 1}
    `;

    const servicesResult =
      await pool.query(
        servicesQuery,
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
      data: servicesResult.rows.map(
        (service) => ({
          id: service.id,

          name: service.name,

          category:
            service.category,

          description:
            service.description,

          basePrice: Number(
            service.base_price
          ),

          bookings: Number(
            service.booking_count
          ),

          revenue: Number(
            service.total_revenue
          ),
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
      "Services error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load services",
    });
  }
}