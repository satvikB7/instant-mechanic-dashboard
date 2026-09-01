import express from "express";

import {
  getCustomers,
} from "../controllers/customers.controller";

import {
  getCustomerDetails,
} from "../controllers/customerDetails.controller";

const router = express.Router();

router.get("/", getCustomers);

router.get("/:id", getCustomerDetails);

export default router;