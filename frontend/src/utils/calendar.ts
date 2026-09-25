/**
 * Calendar integration for confirmed appointments.
 *
 * Place this file at: src/utils/calendar.ts
 * (or wherever your import path `../utils/calendar` in BookingForm.tsx resolves to)
 */

export interface CalendarAppointment {
  id?: string | number;
  serviceName: string;
  barberName: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:MM" (24h) */
  startTime: string;
  /** "HH:MM" (24h) */
  endTime: string;
  price?: number;
  shopName: string;
  location: string;
}

/* ------------------------------------------------------------------ */
/* Shared helpers                                                       */
/* ------------------------------------------------------------------ */

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** "YYYY-MM-DD" + "HH:MM" -> "YYYYMMDDTHHMMSS" (floating local time). */
function toCompactDateTime(date: string, time: string): string {
  const compactDate = date.replace(/-/g, "");
  const [hours, minutes] = time.split(":");
  return `${compactDate}T${pad2(Number(hours))}${pad2(Number(minutes))}00`;
}

/** Current UTC timestamp in ICS format, e.g. "20260928T140000Z". */
function nowAsICSTimestamp(): string {
  return `${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function buildDescription(appointment: CalendarAppointment): string {
  const lines = [
    `Service: ${appointment.serviceName}`,
    `Barber: ${appointment.barberName}`,
  ];

  if (typeof appointment.price === "number") {
    lines.push(`Price: R${appointment.price}`);
  }

  if (appointment.id !== undefined && appointment.id !== null) {
    lines.push(`Booking reference: #${appointment.id}`);
  }

  lines.push("", `Booked with ${appointment.shopName}`);

  return lines.join("\n");
}

function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/* ------------------------------------------------------------------ */
/* Google Calendar                                                      */
/* ------------------------------------------------------------------ */

/**
 * Opens a pre-filled "Add to Google Calendar" page in a new tab.
 * Uses the browser's IANA timezone (via `ctz`) so the event lands on the
 * correct local wall-clock time regardless of the viewer's Google account
 * timezone setting.
 */
export function addAppointmentToGoogleCalendar(
  appointment: CalendarAppointment
): void {
  const start = toCompactDateTime(appointment.date, appointment.startTime);
  const end = toCompactDateTime(appointment.date, appointment.endTime);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${appointment.serviceName} — ${appointment.shopName}`,
    dates: `${start}/${end}`,
    details: buildDescription(appointment),
    location: appointment.location,
    ctz: getBrowserTimeZone(),
  });

  window.open(
    `https://calendar.google.com/calendar/render?${params.toString()}`,
    "_blank",
    "noopener,noreferrer"
  );
}

/* ------------------------------------------------------------------ */
/* .ics file (Apple Calendar / Outlook / anything else that reads ICS)  */
/* ------------------------------------------------------------------ */

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function triggerFileDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Builds and downloads a standards-compliant .ics file for the appointment,
 * for Apple Calendar, Outlook, or any other app that can import ICS files.
 */
export function downloadAppointmentICS(appointment: CalendarAppointment): void {
  const uid = `appointment-${appointment.id ?? Date.now()}@${appointment.shopName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${appointment.shopName}//Booking//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowAsICSTimestamp()}`,
    `DTSTART:${toCompactDateTime(appointment.date, appointment.startTime)}`,
    `DTEND:${toCompactDateTime(appointment.date, appointment.endTime)}`,
    `SUMMARY:${escapeICSText(
      `${appointment.serviceName} — ${appointment.shopName}`
    )}`,
    `DESCRIPTION:${escapeICSText(buildDescription(appointment))}`,
    `LOCATION:${escapeICSText(appointment.location)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  triggerFileDownload(`appointment-${appointment.id ?? "booking"}.ics`, icsContent);
}