import db from "../config/db";
import type { RowDataPacket } from "mysql2";

export const findServiceById = (
  serviceId: number,
  callback: (err: any, result?: any) => void,
) => {
  const sql = `
    SELECT id, duration_minutes
    FROM service
    WHERE id = ? AND is_active = TRUE
  `;

  db.query(sql, [serviceId], callback);
};

export const findAppointmentConflict = (
  barberId: number,
  appointmentDate: string,
  startTime: string,
  endTime: string,
  callback: (err: any, result?: any) => void,
) => {
  const sql = `
    SELECT id
    FROM appointment
    WHERE barber_id = ?
      AND appointment_date = ?
      AND status = 'CONFIRMED'
      AND start_time < ?
      AND end_time > ?
    LIMIT 1
  `;

  db.query(sql, [barberId, appointmentDate, endTime, startTime], callback);
};

export const createCustomer = (
  name: string,
  email: string,
  phone: string,
  callback: (err: any, result?: any) => void,
) => {
  const sql = `
    INSERT INTO customer (name, email, phone)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, phone], callback);
};

export const createAppointment = (
  customerId: number,
  barberId: number,
  serviceId: number,
  appointmentDate: string,
  startTime: string,
  endTime: string,
  notes: string | null,
  callback: (err: any, result?: any) => void,
) => {
  const sql = `
    INSERT INTO appointment
    (
      customer_id,
      barber_id,
      service_id,
      appointment_date,
      start_time,
      end_time,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      customerId,
      barberId,
      serviceId,
      appointmentDate,
      startTime,
      endTime,
      notes,
    ],
    callback,
  );
};

/**NEW */


export interface ServiceRow extends RowDataPacket {
  id: number;
  duration_minutes: number;
}

export interface BarberRow extends RowDataPacket {
  id: number;
}

export interface BusinessHoursRow extends RowDataPacket {
  open_time: string | null;
  close_time: string | null;
  is_closed: number;
}

export interface BookedAppointmentRow extends RowDataPacket {
  start_time: string;
  end_time: string;
}

export const findActiveService = (
  serviceId: number,
  callback: (err: Error | null, rows?: ServiceRow[]) => void,
) => {
  db.query<ServiceRow[]>(
    `SELECT id, duration_minutes
     FROM service
     WHERE id = ? AND is_active = TRUE`,
    [serviceId],
    (err, rows) => callback(err, rows),
  );
};

export const findActiveBarber = (
  barberId: number,
  callback: (err: Error | null, rows?: BarberRow[]) => void,
) => {
  db.query<BarberRow[]>(
    `SELECT id FROM barber
     WHERE id = ? AND is_active = TRUE`,
    [barberId],
    (err, rows) => callback(err, rows),
  );
};

export const findBusinessHours = (
  dayOfWeek: number,
  callback: (err: Error | null, rows?: BusinessHoursRow[]) => void,
) => {
  db.query<BusinessHoursRow[]>(
    `SELECT open_time, close_time, is_closed
     FROM business_hour
     WHERE day_of_week = ?`,
    [dayOfWeek],
    (err, rows) => callback(err, rows),
  );
};

export const findBookedAppointments = (
  barberId: number,
  date: string,
  callback: (err: Error | null, rows?: BookedAppointmentRow[]) => void,
) => {
  db.query<BookedAppointmentRow[]>(
    `SELECT start_time, end_time
     FROM appointment
     WHERE barber_id = ?
       AND appointment_date = ?
       AND status = 'CONFIRMED'
     ORDER BY start_time`,
    [barberId, date],
    (err, rows) => callback(err, rows),
  );
};
