import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getMechanics(
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

    const status =
      typeof req.query.status === "string"
        ? req.query.status
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
      id: "m.id",
      name: "m.name",
      phone: "m.phone",
      status: "m.status",
      specialization: "m.specialization",
      jobsCompleted: "m.jobs_completed",
      createdAt: "m.created_at",
    };

    const orderColumn =
      sortColumns[sortBy] || "m.name";

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
          m.name ILIKE $${parameterIndex}
          OR m.phone ILIKE $${parameterIndex}
          OR m.specialization ILIKE $${parameterIndex}
        )
      `);

      values.push(`%${search}%`);
      parameterIndex++;
    }

    // Status filter
    if (status) {
      conditions.push(
        `m.status = $${parameterIndex}`
      );

      values.push(status);
      parameterIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // --------------------------------
    // Count mechanics
    // --------------------------------

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM mechanics m
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
    // Get mechanics
    // --------------------------------

    const mechanicsQuery = `
      SELECT
        m.id,
        m.name,
        m.phone,
        m.status,
        m.specialization,
        m.jobs_completed,
        m.created_at

      FROM mechanics m

      ${whereClause}

      ORDER BY ${orderColumn} ${sortOrder}

      LIMIT $${parameterIndex}
      OFFSET $${parameterIndex + 1}
    `;

    const mechanicsResult =
      await pool.query(
        mechanicsQuery,
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
      data: mechanicsResult.rows.map(
        (mechanic) => ({
          id: mechanic.id,

          name: mechanic.name,

          phone: mechanic.phone,

          status: mechanic.status,

          specialization:
            mechanic.specialization,

          jobsCompleted: Number(
            mechanic.jobs_completed
          ),

          createdAt:
            mechanic.created_at,
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
      "Mechanics error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load mechanics",
    });
  }
}