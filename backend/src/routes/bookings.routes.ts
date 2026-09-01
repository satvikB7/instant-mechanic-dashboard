import express from "express";

import {
  getBookings,
} from "../controllers/bookings.controller";

import {
  getBookingDetails,
} from "../controllers/bookingDetails.controller";

const router = express.Router();

router.get("/", getBookings);

router.get("/:id", getBookingDetails);

export default router;