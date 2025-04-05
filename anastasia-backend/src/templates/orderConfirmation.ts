import { baseTemplate } from "./baseTemplate";

interface OrderConfirmationParams {
  name: string;
  itemsList: string;
  totalPrice: number;
}

export const orderConfirmationTemplate = ({
  name,
  itemsList,
  totalPrice,
}: OrderConfirmationParams): string => {
  const content = `
    <h2>Hallo ${name},</h2>
    <p>vielen Dank für Ihre Bestellung bei <strong>Anastasia Massage</strong>.</p>
    <p>Ihre Bestellung wurde erfolgreich aufgegeben und wird nun bearbeitet.</p>

    <table style="margin-top: 20px; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 12px;"><strong>🛍️ Produkte:</strong></td>
        <td style="padding: 8px 12px;">${itemsList}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px;"><strong>💰 Gesamtpreis:</strong></td>
        <td style="padding: 8px 12px;">€${totalPrice.toFixed(2)}</td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      Sie erhalten eine Benachrichtigung, sobald Ihre Bestellung versendet wurde.
    </p>

    <p>Mit freundlichen Grüßen,<br/>Ihr Anastasia Massage Team</p>
  `;

  return baseTemplate(content, "🧾 Bestellbestätigung");
};
