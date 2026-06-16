import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function sendMail({ to, subject, text, html }) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html || `<p>${text}</p>`;

  sendSmtpEmail.sender = {
    email: process.env.BREVO_SENDER_EMAIL,
    name: "MediQueue",
  };

  sendSmtpEmail.to = [{ email: to }];

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
}