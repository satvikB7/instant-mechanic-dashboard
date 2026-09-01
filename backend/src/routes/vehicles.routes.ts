import { Router } from "express";

import {
  getVehicles,
} from "../controllers/vehicles.controller";

const router = Router();

router.get("/", getVehicles);

export default router;