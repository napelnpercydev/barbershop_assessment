import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/appointmentRoutes.js";
import barberRoutes from "./routes/barberRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/appointments", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
