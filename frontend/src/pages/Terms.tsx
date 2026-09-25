import "../styles/Terms.css";

const terms = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By using this website or making an appointment through our booking system, you agree to these Terms and Conditions. If you do not agree with any part of these terms, please do not use the booking service.",
  },
  {
    title: "2. Booking Appointments",
    content:
      "Appointments can be booked through the online booking system by selecting an available service, barber, date, and time. An appointment is only considered confirmed once the booking has been successfully submitted and confirmation has been provided.",
  },
  {
    title: "3. Customer Information",
    content:
      "Customers are responsible for providing accurate and complete information when making an appointment, including their name, email address, and phone number. Incorrect information may prevent us from contacting you about your appointment.",
  },
  {
    title: "4. Appointment Availability",
    content:
      "Available appointment times are based on the selected barber's availability, the selected service duration, existing appointments, and the barbershop's operating hours. Availability may change at any time.",
  },
  {
    title: "5. Appointment Conflicts",
    content:
      "The booking system checks appointment availability when a booking is submitted. A time slot may become unavailable if another customer books it before your appointment is confirmed.",
  },
  {
    title: "6. Appointment Times",
    content:
      "Customers are expected to arrive at the scheduled appointment time. Please allow sufficient time to arrive, check in, and prepare for your service.",
  },
  {
    title: "7. Late Arrivals",
    content:
      "Late arrival may reduce the time available for your selected service or may require the appointment to be rescheduled. The barbershop reserves the right to determine whether a late appointment can still be accommodated.",
  },
  {
    title: "8. Cancellations",
    content:
      "Customers who are unable to attend an appointment should cancel or contact the barbershop as soon as reasonably possible. Cancellation procedures may be subject to the barbershop's current policies.",
  },
  {
    title: "9. No-Shows",
    content:
      "Failure to attend a confirmed appointment without reasonable notice may be treated as a no-show. Repeated no-shows may affect the customer's ability to make future appointments.",
  },
  {
    title: "10. Services and Pricing",
    content:
      "Service descriptions, prices, and durations displayed on the website are provided for informational and booking purposes. The barbershop reserves the right to update services and pricing when necessary.",
  },
  {
    title: "11. Payments",
    content:
      "Where payment is required, customers are responsible for paying the applicable amount for the selected service. Payment methods and requirements may vary depending on the barbershop's current policies.",
  },
  {
    title: "12. Calendar Integration",
    content:
      "The website may provide options to add a confirmed appointment to a personal calendar. Calendar events are provided for convenience and do not replace the official appointment confirmation from the barbershop.",
  },
  {
    title: "13. Email Communications",
    content:
      "We may use the email address provided during booking to send appointment confirmations and relevant appointment-related communications. Customers should ensure that the email address provided is correct.",
  },
  {
    title: "14. Website Availability",
    content:
      "We aim to keep the website and booking system available and functional, but we cannot guarantee uninterrupted access. Temporary downtime may occur due to maintenance, technical issues, or circumstances outside our control.",
  },
  {
    title: "15. Website Accuracy",
    content:
      "We make reasonable efforts to ensure that information displayed on the website is accurate and current. However, occasional errors or outdated information may occur, and information may be updated without prior notice.",
  },
  {
    title: "16. Personal Information",
    content:
      "Personal information submitted through the booking system is handled for purposes related to providing and managing appointments and communicating with customers. We will take reasonable measures to protect information submitted through the website.",
  },
  {
    title: "17. Third-Party Services",
    content:
      "The website may use third-party services to provide functionality such as email delivery, hosting, analytics, maps, or calendar integration. These services may process information in accordance with their own terms and privacy policies.",
  },
  {
    title: "18. Acceptable Use",
    content:
      "Customers must not misuse the website, attempt to interfere with its operation, submit false information, attempt unauthorized access, or use the booking system for fraudulent or unlawful purposes.",
  },
  {
    title: "19. Changes to These Terms",
    content:
      "These Terms and Conditions may be updated from time to time to reflect changes to our services, booking process, or operational requirements. The latest version will be published on this page together with the date it was last updated.",
  },
  {
    title: "20. Contact and Questions",
    content:
      "If you have questions about these Terms and Conditions, an appointment, or any of our services, please contact the barbershop using the contact information provided on our website.",
  },
];

const TermsAndConditions = () => {
  return (
    <section className="terms-page">
      <div className="terms-container">
        <header className="terms-header">
          <span className="terms-eyebrow">LEGAL</span>

          <h1>Terms &amp; Conditions</h1>

          <p className="terms-intro">
            Please review the terms below before using our website or booking
            an appointment.
          </p>

          <div className="terms-updated">
            <span>Last updated</span>
            <strong>25 September 2026</strong>
          </div>
        </header>

        <div className="terms-list">
          {terms.map((term) => (
            <article className="terms-item" key={term.title}>
              <h2>{term.title}</h2>
              <p>{term.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;