import {
  findServiceById,
  findAppointmentConflict,
  createCustomer,
  createAppointment,
} from "../models/appointmentModel";

interface CreateAppointmentData {
  serviceId: number;
  barberId: number;
  appointmentDate: string;
  startTime: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export const bookAppointment = (
  data: CreateAppointmentData,
  callback: (err: any, result?: any) => void,
) => {
  const {
    serviceId,
    barberId,
    appointmentDate,
    startTime,
    name,
    email,
    phone,
    notes,
  } = data;

  // 1. Get service duration
  findServiceById(serviceId, (err, serviceResults) => {
    if (err) {
      return callback(err);
    }

    if (!serviceResults || serviceResults.length === 0) {
      return callback({
        status: 404,
        message: "Service not found",
      });
    }

    const duration = serviceResults[0].duration_minutes;

    // 2. Calculate end time
    const start = new Date(`1970-01-01T${startTime}`);

    start.setMinutes(start.getMinutes() + duration);

    const endTime = start.toTimeString().slice(0, 8);

    // 3. Check for conflicting appointment
    findAppointmentConflict(
      barberId,
      appointmentDate,
      startTime,
      endTime,
      (err, conflicts) => {
        if (err) {
          return callback(err);
        }

        if (conflicts && conflicts.length > 0) {
          return callback({
            status: 409,
            message: "This time slot is already booked",
          });
        }

        // 4. Create customer
        createCustomer(name, email, phone, (err, customerResult) => {
          if (err) {
            return callback(err);
          }

          const customerId = customerResult.insertId;

          // 5. Create appointment
          createAppointment(
            customerId,
            barberId,
            serviceId,
            appointmentDate,
            startTime,
            endTime,
            notes || null,
            (err, appointmentResult) => {
              if (err) {
                return callback(err);
              }

              callback(null, {
                appointmentId: appointmentResult.insertId,
                customerId,
                serviceId,
                barberId,
                appointmentDate,
                startTime,
                endTime,
              });
            },
          );
        });
      },
    );
  });
};

/**NEW */

import {
  findActiveService,
  findActiveBarber,
  findBusinessHours,
  findBookedAppointments,
} from "../models/appointmentModel";

interface AvailabilityParams {
  barberId: number;
  serviceId: number;
  date: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilityResult {
  date: string;
  barberId: number;
  serviceId: number;
  slots: TimeSlot[];
}

interface AvailabilityError extends Error {
  status?: number;
}

const SLOT_INTERVAL = 30;
const TIMEZONE = "Africa/Johannesburg";

const makeError = (
  status: number,
  message: string
): AvailabilityError => {
  const error: AvailabilityError = new Error(message);
  error.status = status;
  return error;
};

// Convert MySQL TIME values to minutes since midnight.
const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Convert minutes back to HH:mm.
const toTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// Get today's date and current time in the shop's timezone.
const getShopNow = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
};

export const getAvailableSlots = (
  params: AvailabilityParams,
  callback: (
    err: AvailabilityError | null,
    result?: AvailabilityResult
  ) => void
) => {
  const { barberId, serviceId, date } = params;

  // Validate the date without depending on the server's timezone.
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return callback(makeError(400, "Invalid appointment date"));
  }

  const now = getShopNow();

  if (date < now.date) {
    return callback(
      makeError(400, "Cannot book an appointment in the past")
    );
  }

  const dayOfWeek = parsedDate.getUTCDay();

  // 1. Verify the selected barber.
  findActiveBarber(barberId, (err, barbers) => {
    if (err) return callback(err);

    if (!barbers?.length) {
      return callback(makeError(404, "Barber not found"));
    }

    // 2. Get the selected service's duration.
    findActiveService(serviceId, (err, services) => {
      if (err) return callback(err);

      if (!services?.length) {
        return callback(makeError(404, "Service not found"));
      }

      const duration = services[0].duration_minutes;

      if (!Number.isInteger(duration) || duration <= 0) {
        return callback(
          makeError(500, "Invalid service duration")
        );
      }

      // 3. Get the shop's operating hours.
      findBusinessHours(dayOfWeek, (err, hours) => {
        if (err) return callback(err);

        const businessHours = hours?.[0];

        // Closed days have no available slots.
        if (
          !businessHours ||
          businessHours.is_closed ||
          !businessHours.open_time ||
          !businessHours.close_time
        ) {
          return callback(null, {
            date,
            barberId,
            serviceId,
            slots: [],
          });
        }

        const opening = toMinutes(businessHours.open_time);
        const closing = toMinutes(businessHours.close_time);

        if (closing <= opening) {
          return callback(
            makeError(500, "Invalid business hours")
          );
        }

        // 4. Fetch the barber's existing appointments.
        findBookedAppointments(
          barberId,
          date,
          (err, appointments) => {
            if (err) return callback(err);

            const bookings = (appointments ?? []).map(
              (appointment) => ({
                start: toMinutes(appointment.start_time),
                end: toMinutes(appointment.end_time),
              })
            );

            const slots: TimeSlot[] = [];

            // 5. Generate slots at 30-minute intervals.
            for (
              let start = opening;
              start + duration <= closing;
              start += SLOT_INTERVAL
            ) {
              const end = start + duration;

              // Do not return times that have already passed.
              if (date === now.date && start <= now.minutes) {
                continue;
              }

              // Check for any overlap with existing appointments.
              const hasConflict = bookings.some(
                (booking) =>
                  start < booking.end &&
                  end > booking.start
              );

              if (!hasConflict) {
                slots.push({
                  startTime: toTime(start),
                  endTime: toTime(end),
                });
              }
            }

            return callback(null, {
              date,
              barberId,
              serviceId,
              slots,
            });
          }
        );
      });
    });
  });
};
