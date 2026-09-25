import { useState } from "react";
import { useGetAllBarbers } from "../hooks/useBarber";
import {
  useCreateAppointment,
  useCheckAvailability,
} from "../hooks/useAppointment";
import {
  addAppointmentToGoogleCalendar,
  downloadAppointmentICS,
} from "../utils/calendar";
import styles from "../styles/Booking.module.css";
/* ------------------------------------------------------------------ */
/* Assumed shapes — adjust these to match your real API / hook types. */
/* ------------------------------------------------------------------ */

interface Barber {
  id: number;
  name: string;
  is_active?: boolean;
}

interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
}

interface CreateAppointmentPayload {
  serviceId: number;
  barberId: number;
  appointmentDate: string;
  startTime: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

interface CreateAppointmentResponse {
  id: string | number;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/* Hardcoded data (per spec — services & hours have no hook yet)      */
/* ------------------------------------------------------------------ */

const businessHours: Record<string, { open: string; close: string } | null> = {
  monday: { open: "08:00", close: "17:00" },
  tuesday: { open: "08:00", close: "17:00" },
  wednesday: { open: "08:00", close: "17:00" },
  thursday: { open: "08:00", close: "17:00" },
  friday: { open: "08:00", close: "18:00" },
  saturday: { open: "08:00", close: "15:00" },
  sunday: null,
};

const BUSINESS_HOURS_DISPLAY = [
  { label: "Mon – Thu", value: "08:00 – 17:00" },
  { label: "Friday", value: "08:00 – 18:00" },
  { label: "Saturday", value: "08:00 – 15:00" },
  { label: "Sunday", value: "Closed" },
];

const services: Service[] = [
  { id: 1, name: "Haircut", price: 120, duration_minutes: 30 },
  { id: 2, name: "Haircut + Beard", price: 180, duration_minutes: 45 },
  { id: 3, name: "Full Grooming", price: 250, duration_minutes: 60 },
];

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/* ------------------------------------------------------------------ */
/* Date helpers (local-date safe — avoid UTC off-by-one bugs)          */
/* ------------------------------------------------------------------ */

function localDateFromISO(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getDayKey(dateStr: string): (typeof DAY_KEYS)[number] {
  return DAY_KEYS[localDateFromISO(dateStr).getDay()];
}

function isDateInPast(dateStr: string): boolean {
  const selected = localDateFromISO(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected.getTime() < today.getTime();
}

function formatDisplayDate(dateStr: string): string {
  return localDateFromISO(dateStr).toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* ------------------------------------------------------------------ */

export default function BookingForm() {
  // Selection state
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );

  // Customer details state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Form / submission state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [bookingResult, setBookingResult] =
    useState<CreateAppointmentResponse | null>(null);

  // Barbers — MUST come from the API
  const {
    data: barbers = [],
    isLoading: isLoadingBarbers,
    isError: isBarberError,
  } = useGetAllBarbers();

  const activeBarbers = (barbers as unknown as Barber[]).filter(
    (barber) => barber.is_active !== false,
  );

  // Derived selection info
  const selectedService = services.find((s) => s.id === serviceId) ?? null;
  const selectedBarber =
    activeBarbers.find((b) => b.id === Number(barberId)) ?? null;

  const dateIsPast = date ? isDateInPast(date) : false;
  const isClosedDay = date ? businessHours[getDayKey(date)] === null : false;

  const canCheckAvailability = Boolean(
    serviceId && barberId && date && !dateIsPast && !isClosedDay,
  );

  // Availability — MUST come from the API, only fetched once selections are valid.
  // NOTE: adjust `enabled` if your hook disables the query a different way.
  const {
    data,
    isLoading: isCheckingAvailability,
    isFetching: isFetchingAvailability,
    isError: isAvailabilityError,
    refetch: refetchAvailability,
  } = useCheckAvailability({
    barberId: barberId ?? "",
    serviceId: serviceId ?? 0,
    date: date ?? "",
    enabled: canCheckAvailability,
  } as unknown as Parameters<typeof useCheckAvailability>[0]);

  const availability = (data?.slots ?? []) as AvailabilitySlot[];

  const { mutate: createAppointment, isPending: isCreatingAppointment } =
    useCreateAppointment();

  /* ---------------------------------------------------------------- */
  /* Handlers                                                          */
  /* ---------------------------------------------------------------- */

  const handleServiceChange = (id: number) => {
    setServiceId(id);
    setSelectedSlot(null);
  };

  const handleBarberChange = (value: string) => {
    setBarberId(value || null);
    setSelectedSlot(null);
  };

  const handleDateChange = (value: string) => {
    setDate(value || null);
    setSelectedSlot(null);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = "Full name is required.";

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!phone.trim()) errors.phone = "Phone number is required.";
    if (!serviceId) errors.service = "Please select a service.";
    if (!barberId) errors.barber = "Please select a barber.";

    if (!date) {
      errors.date = "Please select a date.";
    } else if (isDateInPast(date)) {
      errors.date = "Please select a date that is not in the past.";
    } else if (isClosedDay) {
      errors.date = "The barbershop is closed on the selected day.";
    }

    if (!selectedSlot) errors.time = "Please select an available time.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canSubmit = Boolean(
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    serviceId &&
    barberId &&
    date &&
    !dateIsPast &&
    !isClosedDay &&
    selectedSlot &&
    !isCreatingAppointment,
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setConflictMessage(null);

    if (
      !validate() ||
      !selectedService ||
      !selectedBarber ||
      !date ||
      !selectedSlot
    ) {
      return;
    }

    const payload: CreateAppointmentPayload = {
      serviceId: selectedService.id,
      barberId: selectedBarber.id,
      appointmentDate: date,
      startTime: selectedSlot.startTime,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
    };

    createAppointment(
      payload as never,
      {
        onSuccess: (response: unknown) => {
          setBookingResult(response as CreateAppointmentResponse);
        },
        onError: (error: unknown) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;

          if (status === 409) {
            setConflictMessage(
              "That appointment time was just booked by another customer. We're updating the available times. Please select another time.",
            );
            setSelectedSlot(null);
            refetchAvailability();
          } else {
            setSubmitError(
              "Something went wrong while booking your appointment. Please try again.",
            );
          }
        },
      } as never,
    );
  };

  const buildCalendarAppointment = () => ({
    id: bookingResult?.id,
    serviceName: selectedService?.name ?? "",
    barberName: selectedBarber?.name ?? "",
    date: date ?? "",
    startTime: selectedSlot?.startTime ?? "",
    endTime: selectedSlot?.endTime ?? "",
    price: selectedService?.price ?? 0,
    // NOTE: replace with your real brand name / shop address.
    shopName: "Crown & Craft",
    location: "142 Fenwick Street, Johannesburg",
  });

  const handleAddToGoogleCalendar = () => {
    addAppointmentToGoogleCalendar(buildCalendarAppointment());
  };

  const handleAddToAppleCalendar = () => {
    downloadAppointmentICS(buildCalendarAppointment());
  };

  const handleBookAnother = () => {
    setServiceId(null);
    setBarberId(null);
    setDate(null);
    setSelectedSlot(null);
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setFormErrors({});
    setSubmitError(null);
    setConflictMessage(null);
    setBookingResult(null);
  };

  /* ---------------------------------------------------------------- */
  /* Confirmation screen                                                */
  /* ---------------------------------------------------------------- */

  if (
    bookingResult &&
    selectedService &&
    selectedBarber &&
    date &&
    selectedSlot
  ) {
    return (
      <div className={styles.page}>
        <div className={styles.confirmationScreen}>
          <div className={styles.confirmationIcon} aria-hidden="true">
            ✓
          </div>
          <h1 className={styles.confirmationHeading}>Appointment Confirmed</h1>
          <p className={styles.confirmationText}>
            Your appointment has been successfully booked. check your email for
            confirmation.
          </p>

          <div className={styles.confirmationDetails}>
            <p className={styles.confirmationService}>{selectedService.name}</p>
            <p className={styles.confirmationBarber}>{selectedBarber.name}</p>
            <p className={styles.confirmationDate}>{formatDisplayDate(date)}</p>
            <p className={styles.confirmationTime}>
              {selectedSlot.startTime} – {selectedSlot.endTime}
            </p>
            <p className={styles.confirmationPrice}>R{selectedService.price}</p>
          </div>

          <p className={styles.confirmationReference}>
            Booking reference: #{String(bookingResult.id)}
          </p>

          <div className={styles.calendarActions}>
            <p className={styles.calendarLabel}>Add to your calendar</p>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleAddToGoogleCalendar}
            >
              Add to Google Calendar
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleAddToAppleCalendar}
            >
              Add to Apple Calendar
            </button>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleBookAnother}
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Booking form                                                       */
  /* ---------------------------------------------------------------- */

  return (
    <div className={styles.page}>
      <form className={styles.grid} onSubmit={handleSubmit} noValidate>
        {/* Business hours */}
        <div style={{ gridArea: "hours" }} className={styles.panel}>
          <h2 className={styles.sectionHeading}>Business Hours</h2>
          <ul className={styles.hoursList}>
            {BUSINESS_HOURS_DISPLAY.map((row) => (
              <li key={row.label} className={styles.hoursRow}>
                <span>{row.label}</span>
                <span>{row.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Service */}
        <fieldset style={{ gridArea: "service" }} className={styles.panel}>
          <legend className={styles.sectionHeading}>1. Select a Service</legend>
          <div className={styles.serviceGrid}>
            {services.map((service) => {
              const isSelected = serviceId === service.id;
              return (
                <label
                  key={service.id}
                  className={`${styles.serviceCard} ${
                    isSelected ? styles.serviceCardSelected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={isSelected}
                    onChange={() => handleServiceChange(service.id)}
                    className={styles.visuallyHidden}
                  />
                  {isSelected && (
                    <span className={styles.selectedBadge} aria-hidden="true">
                      ✓
                    </span>
                  )}
                  <span className={styles.serviceName}>{service.name}</span>
                  <span className={styles.servicePrice}>R{service.price}</span>
                  <span className={styles.serviceDuration}>
                    {service.duration_minutes} minutes
                  </span>
                </label>
              );
            })}
          </div>
          {formErrors.service && (
            <p className={styles.errorText}>{formErrors.service}</p>
          )}
        </fieldset>

        {/* Barber */}
        <div style={{ gridArea: "barber" }} className={styles.panel}>
          <label htmlFor="barber-select" className={styles.sectionHeading}>
            2. Select a Barber
          </label>

          {isLoadingBarbers ? (
            <p className={styles.helperText}>Loading barbers...</p>
          ) : isBarberError ? (
            <p className={styles.errorText} role="alert">
              We couldn't load our barbers. Please refresh the page.
            </p>
          ) : (
            <select
              id="barber-select"
              className={styles.select}
              value={barberId ?? ""}
              onChange={(event) => handleBarberChange(event.target.value)}
            >
              <option value="" disabled>
                Choose a barber
              </option>
              {activeBarbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          )}
          {formErrors.barber && (
            <p className={styles.errorText}>{formErrors.barber}</p>
          )}
        </div>

        {/* Date */}
        <div style={{ gridArea: "date" }} className={styles.panel}>
          <label htmlFor="date-input" className={styles.sectionHeading}>
            3. Select a Date
          </label>
          <input
            id="date-input"
            type="date"
            className={styles.input}
            min={todayISODate()}
            value={date ?? ""}
            onChange={(event) => handleDateChange(event.target.value)}
          />
          {date && dateIsPast && (
            <p className={styles.errorText} role="alert">
              Please select a date that is not in the past.
            </p>
          )}
          {date && !dateIsPast && isClosedDay && (
            <p className={styles.errorText} role="alert">
              The barbershop is closed on Sundays. Please select another date.
            </p>
          )}
          {formErrors.date && !dateIsPast && !isClosedDay && (
            <p className={styles.errorText}>{formErrors.date}</p>
          )}
        </div>

        {/* Available times */}
        <div style={{ gridArea: "times" }} className={styles.panel}>
          <h2 className={styles.sectionHeading}>4. Available Times</h2>

          {!canCheckAvailability && (
            <p className={styles.helperText}>
              Select a service, barber and valid date to see available times.
            </p>
          )}

          {canCheckAvailability && isCheckingAvailability && (
            <p className={styles.helperText} aria-live="polite">
              Checking available times...
            </p>
          )}

          {canCheckAvailability &&
            !isCheckingAvailability &&
            isFetchingAvailability && (
              <p className={styles.helperText} aria-live="polite">
                Updating available times...
              </p>
            )}

          {canCheckAvailability && isAvailabilityError && (
            <div className={styles.errorBlock}>
              <p className={styles.errorText} role="alert">
                We couldn't check availability.
              </p>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => refetchAvailability()}
              >
                Try Again
              </button>
            </div>
          )}

          {canCheckAvailability &&
            !isCheckingAvailability &&
            !isAvailabilityError &&
            availability.length === 0 && (
              <p className={styles.helperText}>
                No appointments are available for this barber on this date.
                Please choose another date or barber.
              </p>
            )}

          {canCheckAvailability &&
            !isCheckingAvailability &&
            !isAvailabilityError &&
            availability.length > 0 && (
              <div className={styles.slotGrid}>
                {availability.map((slot) => {
                  const isSelected = selectedSlot?.startTime === slot.startTime;
                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      className={`${styles.slotButton} ${
                        isSelected ? styles.slotButtonSelected : ""
                      }`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.startTime}
                    </button>
                  );
                })}
              </div>
            )}

          {conflictMessage && (
            <p className={styles.errorText} role="alert">
              {conflictMessage}
            </p>
          )}
          {formErrors.time && (
            <p className={styles.errorText}>{formErrors.time}</p>
          )}
        </div>

        {/* Customer details */}
        <div style={{ gridArea: "details" }} className={styles.panel}>
          <h2 className={styles.sectionHeading}>5. Your Details</h2>

          {!selectedSlot ? (
            <p className={styles.helperText}>
              Select an appointment time to continue.
            </p>
          ) : (
            <div className={styles.detailsGrid}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  Full name
                </label>
                <input
                  id="name"
                  className={styles.input}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                />
                {formErrors.name && (
                  <p id="name-error" className={styles.errorText}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={
                    formErrors.email ? "email-error" : undefined
                  }
                />
                {formErrors.email && (
                  <p id="email-error" className={styles.errorText}>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={styles.input}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  aria-invalid={Boolean(formErrors.phone)}
                  aria-describedby={
                    formErrors.phone ? "phone-error" : undefined
                  }
                />
                {formErrors.phone && (
                  <p id="phone-error" className={styles.errorText}>
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label htmlFor="notes" className={styles.label}>
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  className={styles.textarea}
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside
          style={{ gridArea: "summary" }}
          className={styles.summaryPanel}
          aria-label="Appointment summary"
        >
          <h2 className={styles.summaryHeading}>Appointment Summary</h2>

          <dl className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <dt>Service</dt>
              <dd>{selectedService ? selectedService.name : "—"}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Barber</dt>
              <dd>{selectedBarber ? selectedBarber.name : "—"}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Date</dt>
              <dd>{date && !dateIsPast ? formatDisplayDate(date) : "—"}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Time</dt>
              <dd>
                {selectedSlot
                  ? `${selectedSlot.startTime} – ${selectedSlot.endTime}`
                  : "—"}
              </dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Duration</dt>
              <dd>
                {selectedService
                  ? `${selectedService.duration_minutes} minutes`
                  : "—"}
              </dd>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryPriceRow}`}>
              <dt>Price</dt>
              <dd>{selectedService ? `R${selectedService.price}` : "—"}</dd>
            </div>
          </dl>
        </aside>

        {/* Confirm */}
        <div style={{ gridArea: "confirm" }} className={styles.confirmArea}>
          {submitError && (
            <p className={styles.errorText} role="alert">
              {submitError}
            </p>
          )}
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={!canSubmit}
          >
            {isCreatingAppointment
              ? "Booking appointment..."
              : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
