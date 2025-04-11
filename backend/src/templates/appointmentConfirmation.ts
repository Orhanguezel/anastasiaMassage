// src/templates/appointmentConfirmation.ts

import { baseTemplate } from "./baseTemplate";

interface AppointmentConfirmationParams {
  name: string;
  service: string;
  date: string;
  time: string;
}

export const appointmentConfirmationTemplate = ({
  name,
  service,
  date,
  time,
}: AppointmentConfirmationParams): string => {
  const content = `
    <h2>Hallo ${name},</h2>
    <p>vielen Dank für Ihre Terminbuchung bei <strong>Anastasia Massage</strong>.</p>
    <p>Ihre Anfrage wurde erfolgreich empfangen und wird nun verarbeitet.</p>

    <table style="margin-top: 20px; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 12px;"><strong>🧖‍♀️ Behandlung:</strong></td>
        <td style="padding: 8px 12px;">${service}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px;"><strong>📅 Datum:</strong></td>
        <td style="padding: 8px 12px;">${date}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px;"><strong>⏰ Uhrzeit:</strong></td>
        <td style="padding: 8px 12px;">${time}</td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      Sollten Sie Fragen oder Änderungswünsche haben, kontaktieren Sie uns bitte rechtzeitig.
    </p>

    <p>Wir freuen uns, Sie bald persönlich bei uns begrüßen zu dürfen.</p>

    <p style="margin-top: 30px;">
      Herzliche Grüße,<br/>
      <strong>Ihr Anastasia Massage Team</strong>
    </p>
  `;

  return baseTemplate(content, "🗓️ Terminbestätigung");
};
