import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_API_KEY);

interface AppointmentEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  barberName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
}

export const sendAppointmentConfirmation = async (
  data: AppointmentEmailData,
) => {
  const {
    customerName,
    customerEmail,
    serviceName,
    barberName,
    appointmentDate,
    startTime,
    endTime,
  } = data;

  console.log(data,"lol");
  const { data: emailData, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: customerEmail,
    subject: "Appointment Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Confirmed</h2>

        <p>Hi ${customerName},</p>

        <p>
          Your appointment has been successfully booked.
        </p>

        <h3>Appointment Details</h3>

        <p>
          <strong>Service:</strong> ${serviceName}<br />
          <strong>Barber:</strong> ${barberName}<br />
          <strong>Date:</strong> ${appointmentDate}<br />
          <strong>Time:</strong> ${startTime} - ${endTime}
        </p>

        <p>
          We look forward to seeing you!
        </p>

        <p>
          Thank you.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return emailData;
};
