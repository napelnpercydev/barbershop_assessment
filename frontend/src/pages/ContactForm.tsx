import { useState, type FormEvent } from "react";
import styles from "../styles/ContactForm.module.css";
import { sendContactMessage } from "../services/emailService";

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface HourRow {
  day: string;
  time: string;
}

interface ContactFormProps {
  address?: string;
  hours?: HourRow[];
  phone?: string;
  email?: string;
}

const SUBJECT_OPTIONS = [
  { value: "general", label: "General Enquiry" },
  { value: "booking", label: "Booking Question" },
  { value: "feedback", label: "Feedback" },
  { value: "partnership", label: "Partnership / Press" },
  { value: "other", label: "Other" },
];

const DEFAULT_HOURS: HourRow[] = [
  { day: "Monday – Thursday", time: "08:00 – 17:00" },
  { day: "Friday", time: "08:00 – 18:00" },
  { day: "Saturday", time: "08:00 – 15:00" },
  { day: "Sunday", time: "Closed" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm({
  address = "142 Fenwick Street, Johannesburg",
  hours = DEFAULT_HOURS,
  phone = "+27 11 555 0182",
  email: contactEmail = "hello@crownandcraft.co",
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = "Please enter your name.";

    if (!email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!subject) nextErrors.subject = "Please select a subject.";
    if (!message.trim()) nextErrors.message = "Please enter a message.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setStatus("loading");

    try {
      const payload = { name, email, subject, message };
      await sendContactMessage(payload);
      setStatus("success");
    } catch {
      setStatus("error");
      setSubmitError(
        "Something went wrong while sending your message. Please try again.",
      );
    }
  };

  const handleSendAnother = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
    setSubmitError(null);
    setStatus("idle");
  };

  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.grid}>
        {/* Form */}
        <div className={styles.formPanel}>
          {status === "success" ? (
            <div className={styles.successState}>
              <div className={styles.successIcon} aria-hidden="true">
                ✓
              </div>
              <h2 className={styles.successHeading}>Message Sent</h2>
              <p className={styles.successText}>
                Thanks for reaching out — we'll get back to you as soon as we
                can.
              </p>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleSendAnother}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 id="contact-heading" className={styles.formHeading}>
                Get In Touch
              </h2>
              <p className={styles.formIntro}>
                Have a question, feedback, or a partnership idea? Send us a
                message and we'll respond as soon as we can.
              </p>

              {status === "error" && submitError && (
                <p className={styles.formBannerError} role="alert">
                  {submitError}
                </p>
              )}

              <div className={styles.field}>
                <label htmlFor="contact-name" className={styles.label}>
                  Full name
                </label>
                <input
                  id="contact-name"
                  className={styles.input}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  disabled={status === "loading"}
                />
                {errors.name && (
                  <p id="contact-name-error" className={styles.errorText}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email" className={styles.label}>
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
                  }
                  disabled={status === "loading"}
                />
                {errors.email && (
                  <p id="contact-email-error" className={styles.errorText}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-subject" className={styles.label}>
                  Subject
                </label>
                <select
                  id="contact-subject"
                  className={styles.select}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={
                    errors.subject ? "contact-subject-error" : undefined
                  }
                  disabled={status === "loading"}
                >
                  <option value="" disabled>
                    Choose a subject
                  </option>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p id="contact-subject-error" className={styles.errorText}>
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-message" className={styles.label}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className={styles.textarea}
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  disabled={status === "loading"}
                />
                {errors.message && (
                  <p id="contact-message-error" className={styles.errorText}>
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Info panel */}
        <aside className={styles.infoPanel} aria-label="Contact information">
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span className={styles.eyebrow}>Contact</span>
          </div>
          <h3 className={styles.infoHeading}>Visit or Reach Out</h3>

          <ul className={styles.infoList}>
            <li className={styles.infoRow}>
              <span className={styles.infoLabel}>Address</span>
              <span className={styles.infoValue}>{address}</span>
            </li>
            <li className={styles.infoRow}>
              <span className={styles.infoLabel}>Phone</span>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className={styles.infoLink}
              >
                {phone}
              </a>
            </li>
            <li className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <a href={`mailto:${contactEmail}`} className={styles.infoLink}>
                {contactEmail}
              </a>
            </li>
          </ul>

          <div className={styles.hoursBlock}>
            <span className={styles.infoLabel}>Working Hours</span>
            <ul className={styles.hoursList}>
              {hours.map((row) => (
                <li key={row.day} className={styles.hoursRow}>
                  <span>{row.day}</span>
                  <span>{row.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
