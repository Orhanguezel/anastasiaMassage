import { baseTemplate } from "./baseTemplate";

interface WelcomeTemplateParams {
  name: string;
}

export const welcomeTemplate = ({ name }: WelcomeTemplateParams): string => {
  const content = `
    <h2>Willkommen, ${name}!</h2>
    <p>Vielen Dank für Ihre Registrierung bei <strong>Anastasia Massage</strong>.</p>
    <p>Wir freuen uns, Sie bei Ihrer Reise zu Entspannung und Wohlbefinden begleiten zu dürfen.</p>
    <p>Sie können nun bequem online Termine buchen und unsere exklusiven Wellnessprodukte entdecken.</p>
    <p>Herzlichst,<br/>Ihr Anastasia Massage Team</p>
  `;

  return baseTemplate(content, "Willkommen bei Anastasia Massage");
};
