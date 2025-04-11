import { baseTemplate } from "./baseTemplate";

interface PasswordResetTemplateParams {
  name: string;
  resetLink: string;
}

export const passwordResetTemplate = ({
  name,
  resetLink,
}: PasswordResetTemplateParams): string => {
  const content = `
    <h2>Hallo ${name},</h2>
    <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
    <p>Klicken Sie auf den folgenden Button, um Ihr Passwort zurückzusetzen:</p>
    <p style="text-align: center; margin: 20px 0;">
      <a href="${resetLink}" style="padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">
        Passwort zurücksetzen
      </a>
    </p>
    <p>Wenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
    <p>Mit freundlichen Grüßen,<br/>Ihr Anastasia Massage Team</p>
  `;

  return baseTemplate(content, "Passwort zurücksetzen");
};
