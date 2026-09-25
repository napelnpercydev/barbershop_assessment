import { Router } from "express";
import {
  healthCheck,
  createAppointment,
  getAvailability,
} from "../controllers/appointmentController.js";

const router = Router();

router.get("/", healthCheck);

router.post("/", createAppointment);

router.get("/availability", getAvailability);

export default router;
