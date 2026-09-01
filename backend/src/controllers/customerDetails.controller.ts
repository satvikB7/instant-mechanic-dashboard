import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getCustomerDetails(
  req: Request,
  res: Response
) {
  try {
    const customerId = Number(req.params.id);

    if (!Number.isInteger(customerId) || customerId <= 0) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    // --------------------------------
    // Get customer
    // --------------------------------

    const customerQuery = `
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

      WHERE c.id = $1

      GROUP BY
        c.id,
        c.name,
        c.email,
        c.phone,
        c.created_at
    `;

    const customerResult = await pool.query(
      customerQuery,
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const customer = customerResult.rows[0];

    // --------------------------------
    // Get customer's vehicles
    // --------------------------------

    const vehiclesQuery = `
      SELECT
        id,
        make,
        model,
        year,
        registration_number
      FROM vehicles
      WHERE customer_id = $1
      ORDER BY id DESC
    `;

    const vehiclesResult = await pool.query(
      vehiclesQuery,
      [customerId]
    );

    // --------------------------------
    // Get customer's bookings
    // --------------------------------

    const bookingsQuery = `
      SELECT
        b.id,

        v.make AS vehicle_make,
        v.model AS vehicle_model,

        s.name AS service,

        m.name AS mechanic,

        b.status,
        b.amount,
        b.scheduled_at,
        b.created_at

      FROM bookings b

      JOIN vehicles v
        ON b.vehicle_id = v.id

      JOIN services s
        ON b.service_id = s.id

      LEFT JOIN mechanics m
        ON b.mechanic_id = m.id

      WHERE b.customer_id = $1

      ORDER BY b.scheduled_at DESC
    `;

    const bookingsResult = await pool.query(
      bookingsQuery,
      [customerId]
    );

    // --------------------------------
    // Response
    // --------------------------------

    res.json({
      customer: {
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

        createdAt: customer.created_at,
      },

      vehicles: vehiclesResult.rows.map(
        (vehicle) => ({
          id: vehicle.id,

          make: vehicle.make,

          model: vehicle.model,

          year: vehicle.year,

          registrationNumber:
            vehicle.registration_number,
        })
      ),

      bookings: bookingsResult.rows.map(
        (booking) => ({
          id: booking.id,

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
    });

  } catch (error) {
    console.error(
      "Customer details error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load customer details",
    });
  }
}