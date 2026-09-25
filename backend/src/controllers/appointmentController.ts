import { Request, Response } from "express";

import {
  bookAppointment,
  getAvailableSlots,
} from "../services/appointmentService";

export const createAppointment = (req: Request, res: Response) => {
  const {
    serviceId,
    barberId,
    appointmentDate,
    startTime,
    name,
    email,
    phone,
    notes,
  } = req.body;

  if (
    !serviceId ||
    !barberId ||
    !appointmentDate ||
    !startTime ||
    !name ||
    !email ||
    !phone
  ) {
    return res.status(400).json({
      message: "Missing required appointment information",
    });
  }

  bookAppointment(
    {
      serviceId,
      barberId,
      appointmentDate,
      startTime,
      name,
      email,
      phone,
      notes,
    },
    (err, result) => {
      if (err) {
        console.error("Appointment booking error:", err);

        return res.status(err.status || 500).json({
          message: err.message || "Failed to create appointment",
        });
      }

      return res.status(201).json({
        message: "Appointment booked successfully",
        appointment: result,
      });
    },
  );
};

/**NEW */

export const getAvailability = (req: Request, res: Response) => {
  const { barberId, serviceId, date } = req.query;

  const barber = Number(barberId);
  const service = Number(serviceId);

  if (
    !Number.isSafeInteger(barber) ||
    barber <= 0 ||
    !Number.isSafeInteger(service) ||
    service <= 0 ||
    typeof date !== "string"
  ) {
    return res.status(400).json({
      message: "Valid barberId, serviceId and date are required",
    });
  }

  getAvailableSlots(
    {
      barberId: barber,
      serviceId: service,
      date,
    },
    (err, result) => {
      if (err) {
        console.error("Availability error:", err);

        return res.status(err.status || 500).json({
          message:
            err.status && err.status < 500
              ? err.message
              : "Failed to fetch availability",
        });
      }

      return res.status(200).json(result);
    },
  );
};

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Barbershop API is running BRO",
  });
};
