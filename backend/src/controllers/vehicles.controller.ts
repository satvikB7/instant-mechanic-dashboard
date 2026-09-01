import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getVehicles(
  req: Request,
  res: Response
) {
  try {
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

    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: unknown[] = [];

    let parameterIndex = 1;

    // Search vehicle or customer
    if (search) {
      conditions.push(`
        (
          v.make ILIKE $${parameterIndex}
          OR v.model ILIKE $${parameterIndex}
          OR v.registration_number ILIKE $${parameterIndex}
          OR c.name ILIKE $${parameterIndex}
        )
      `);

      values.push(`%${search}%`);
      parameterIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // Total vehicles
    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM vehicles v
      JOIN customers c
        ON v.customer_id = c.id
      ${whereClause}
      `,
      values
    );

    const total = Number(
      countResult.rows[0].total
    );

    // Vehicles
    const vehiclesResult = await pool.query(
      `
      SELECT
        v.id,
        v.make,
        v.model,
        v.year,
        v.registration_number,
        c.id AS customer_id,
        c.name AS customer,

        COUNT(b.id) AS booking_count

      FROM vehicles v

      JOIN customers c
        ON v.customer_id = c.id

      LEFT JOIN bookings b
        ON v.id = b.vehicle_id

      ${whereClause}

      GROUP BY
        v.id,
        v.make,
        v.model,
        v.year,
        v.registration_number,
        c.id,
        c.name

      ORDER BY v.id DESC

      LIMIT $${parameterIndex}
      OFFSET $${parameterIndex + 1}
      `,
      [
        ...values,
        limit,
        offset,
      ]
    );

    res.json({
      data: vehiclesResult.rows.map(
        (vehicle) => ({
          id: vehicle.id,

          make: vehicle.make,

          model: vehicle.model,

          year: vehicle.year,

          registrationNumber:
            vehicle.registration_number,

          customerId:
            vehicle.customer_id,

          customer:
            vehicle.customer,

          bookings: Number(
            vehicle.booking_count
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
      "Vehicles error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load vehicles",
    });
  }
}