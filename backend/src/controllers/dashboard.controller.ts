import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getDashboard(
  _req: Request,
  res: Response
) {
  try {
    // ------------------------------------
    // 1. SUMMARY / KPI DATA
    // ------------------------------------

    const summaryResult = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM bookings) AS total_bookings,

        (SELECT COUNT(*) FROM customers) AS total_customers,

        (
          SELECT COUNT(*)
          FROM mechanics
          WHERE status != 'OFFLINE'
        ) AS active_mechanics,

        (
          SELECT COALESCE(SUM(amount), 0)
          FROM bookings
          WHERE status = 'COMPLETED'
        ) AS total_revenue
    `);

    // ------------------------------------
    // 2. BOOKINGS OVER TIME
    // ------------------------------------

    const bookingsOverTimeResult = await pool.query(`
      SELECT
        DATE(scheduled_at) AS date,
        COUNT(*) AS bookings
      FROM bookings
      GROUP BY DATE(scheduled_at)
      ORDER BY date ASC
    `);

    // ------------------------------------
    // 3. SERVICE BREAKDOWN
    // ------------------------------------

    const serviceBreakdownResult = await pool.query(`
      SELECT
        s.name AS service,
        COUNT(b.id) AS bookings
      FROM bookings b
      JOIN services s
        ON b.service_id = s.id
      GROUP BY s.name
      ORDER BY bookings DESC
    `);

    // ------------------------------------
    // 4. BOOKING STATUS DISTRIBUTION
    // ------------------------------------

    const statusDistributionResult = await pool.query(`
      SELECT
        status,
        COUNT(*) AS count
      FROM bookings
      GROUP BY status
      ORDER BY count DESC
    `);

    // ------------------------------------
    // 5. RECENT BOOKINGS
    // ------------------------------------

    const recentBookingsResult = await pool.query(`
      SELECT
        b.id,
        c.name AS customer,
        v.make || ' ' || v.model AS vehicle,
        s.name AS service,
        m.name AS mechanic,
        b.status,
        b.amount,
        b.scheduled_at
      FROM bookings b

      JOIN customers c
        ON b.customer_id = c.id

      JOIN vehicles v
        ON b.vehicle_id = v.id

      JOIN services s
        ON b.service_id = s.id

      LEFT JOIN mechanics m
        ON b.mechanic_id = m.id

      ORDER BY b.scheduled_at DESC

      LIMIT 10
    `);

    // ------------------------------------
    // 6. MECHANIC WORKLOAD
    // ------------------------------------

    const mechanicWorkloadResult = await pool.query(`
      SELECT
        m.id,
        m.name AS mechanic,

        COUNT(
          CASE
            WHEN b.status != 'CANCELLED'
            THEN b.id
          END
        ) AS assigned_jobs,

        COUNT(
          CASE
            WHEN b.status = 'COMPLETED'
            THEN b.id
          END
        ) AS completed_jobs

      FROM mechanics m

      LEFT JOIN bookings b
        ON m.id = b.mechanic_id

      GROUP BY m.id, m.name

      ORDER BY assigned_jobs DESC
    `);

    // ------------------------------------
    // 7. BUILD RESPONSE
    // ------------------------------------

    const summary = summaryResult.rows[0];

    res.json({
      summary: {
        totalBookings: Number(
          summary.total_bookings
        ),

        totalCustomers: Number(
          summary.total_customers
        ),

        activeMechanics: Number(
          summary.active_mechanics
        ),

        totalRevenue: Number(
          summary.total_revenue
        ),
      },

      bookingsOverTime:
        bookingsOverTimeResult.rows.map(
          (row) => ({
            date: row.date,
            bookings: Number(row.bookings),
          })
        ),

      serviceBreakdown:
        serviceBreakdownResult.rows.map(
          (row) => ({
            service: row.service,
            bookings: Number(row.bookings),
          })
        ),

      statusDistribution:
        statusDistributionResult.rows.map(
          (row) => ({
            status: row.status,
            count: Number(row.count),
          })
        ),

      recentBookings:
        recentBookingsResult.rows.map(
          (row) => ({
            id: row.id,
            customer: row.customer,
            vehicle: row.vehicle,
            service: row.service,
            mechanic: row.mechanic,
            status: row.status,
            amount: Number(row.amount),
            scheduledAt: row.scheduled_at,
          })
        ),

      mechanicWorkload:
        mechanicWorkloadResult.rows.map(
          (row) => ({
            id: row.id,
            mechanic: row.mechanic,
            assignedJobs: Number(
              row.assigned_jobs
            ),
            completedJobs: Number(
              row.completed_jobs
            ),
          })
        ),
    });

  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load dashboard data",
    });
  }
}