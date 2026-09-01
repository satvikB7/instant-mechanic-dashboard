import { Request, Response } from "express";
import { pool } from "../config/database";

export async function getMechanicDetails(
  req: Request,
  res: Response
) {
  try {
    const mechanicId = Number(req.params.id);

    if (
      !Number.isInteger(mechanicId) ||
      mechanicId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid mechanic ID",
      });
    }

    const mechanicQuery = `
      SELECT
        m.id,
        m.name,
        m.phone,
        m.specialization,
        m.status,
        m.created_at
      FROM mechanics m
      WHERE m.id = $1
    `;

    const mechanicResult = await pool.query(
      mechanicQuery,
      [mechanicId]
    );

    if (mechanicResult.rows.length === 0) {
      return res.status(404).json({
        message: "Mechanic not found",
      });
    }

    const mechanic = mechanicResult.rows[0];

    const bookingsQuery = `
      SELECT
        b.id,
        b.status,
        b.amount,
        b.scheduled_at,

        c.name AS customer_name,

        v.make AS vehicle_make,
        v.model AS vehicle_model,
        v.registration_number,

        s.name AS service_name

      FROM bookings b

      JOIN customers c
        ON b.customer_id = c.id

      JOIN vehicles v
        ON b.vehicle_id = v.id

      JOIN services s
        ON b.service_id = s.id

      WHERE b.mechanic_id = $1

      ORDER BY b.scheduled_at DESC
    `;

    const bookingsResult = await pool.query(
      bookingsQuery,
      [mechanicId]
    );

    res.json({
      mechanic: {
        id: mechanic.id,
        name: mechanic.name,
        phone: mechanic.phone,
        specialization: mechanic.specialization,
        status: mechanic.status,
        createdAt: mechanic.created_at,
      },

      bookings: bookingsResult.rows.map(
        (booking) => ({
          id: booking.id,
          status: booking.status,
          amount: Number(booking.amount),
          scheduledAt: booking.scheduled_at,
          customer: booking.customer_name,
          vehicle: `${booking.vehicle_make} ${booking.vehicle_model}`,
          registrationNumber:
            booking.registration_number,
          service: booking.service_name,
        })
      ),
    });
  } catch (error) {
    console.error(
      "Mechanic details error:",
      error
    );

    res.status(500).json({
      message: "Failed to load mechanic details",
    });
  }
}