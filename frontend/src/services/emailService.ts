import emailjs from "@emailjs/browser";
// import type { AppointmentConfirmation } from "../api/appointmentApi";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env
  .VITE_BOOKING_CONFIRMATION_TEMPLATE_ID;
const EMAILJS_CONTACT_US_TEMPLATE_ID = import.meta.env
  .VITE_CONTACT_US_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

//send confrimation
export const sendAppointmentConfirmation = async (appointment) => {
  const {
    appointmentId,
    customer,
    service,
    barber,
    appointmentDate,
    startTime,
    endTime,
    notes,
  } = appointment;

  const templateParams = {
    customer_name: customer.name,
    customer_email: customer.email,

    appointment_id: appointmentId,

    service_name: service.name,
    barber_name: barber.name,

    appointment_date: appointmentDate,
    start_time: startTime,
    end_time: endTime,

    duration: service.durationMinutes,
    price: service.price,

    notes: notes || "No additional notes",
  };

  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
    publicKey: EMAILJS_PUBLIC_KEY,
  });
};

//CONTACT US
export const sendContactMessage = async (data) => {
  const { name, email, subject, message } = data;

  const templateParams = {
    name,
    email,
    subject,
    message,
  };

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_CONTACT_US_TEMPLATE_ID,
    templateParams,
    {
      publicKey: EMAILJS_PUBLIC_KEY,
    },
  );
};
