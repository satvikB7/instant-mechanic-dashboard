import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getBookingDetails(
  req: Request,
  res: Response
) {
  try {
    const bookingId = Number(req.params.id);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    // --------------------------------
    // Get booking details
    // --------------------------------

    const bookingQuery = `
      SELECT
        b.id,

        b.status,
        b.amount,
        b.scheduled_at,
        b.created_at,

        c.id AS customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,

        v.id AS vehicle_id,
        v.make AS vehicle_make,
        v.model AS vehicle_model,
        v.year AS vehicle_year,
        v.registration_number AS vehicle_registration_number,

        s.id AS service_id,
        s.name AS service_name,

        m.id AS mechanic_id,
        m.name AS mechanic_name

      FROM bookings b

      JOIN customers c
        ON b.customer_id = c.id

      JOIN vehicles v
        ON b.vehicle_id = v.id

      JOIN services s
        ON b.service_id = s.id

      LEFT JOIN mechanics m
        ON b.mechanic_id = m.id

      WHERE b.id = $1
    `;

    const bookingResult = await pool.query(
      bookingQuery,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    // --------------------------------
    // Response
    // --------------------------------

    res.json({
      booking: {
        id: booking.id,

        status: booking.status,

        amount: Number(
          booking.amount
        ),

        scheduledAt:
          booking.scheduled_at,

        createdAt:
          booking.created_at,
      },

      customer: {
        id: booking.customer_id,

        name: booking.customer_name,

        email: booking.customer_email,

        phone: booking.customer_phone,
      },

      vehicle: {
        id: booking.vehicle_id,

        make: booking.vehicle_make,

        model: booking.vehicle_model,

        year: booking.vehicle_year,

        registrationNumber:
          booking.vehicle_registration_number,
      },

      service: {
        id: booking.service_id,

        name: booking.service_name,
      },

      mechanic: booking.mechanic_id
        ? {
            id: booking.mechanic_id,

            name: booking.mechanic_name,
          }
        : null,
    });

  } catch (error) {
    console.error(
      "Booking details error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load booking details",
    });
  }
}