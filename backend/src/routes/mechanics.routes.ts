import { Router } from "express";

import {
  getMechanics,
} from "../controllers/mechanics.controller";

import {
  getMechanicDetails,
} from "../controllers/mechanicDetails.controller";

const router = Router();

router.get("/", getMechanics);

router.get("/:id", getMechanicDetails);

export default router;