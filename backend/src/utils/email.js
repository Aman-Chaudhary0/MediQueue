import nodemailer from "nodemailer";

let transporter = null;

function getEnvOrThrow(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getTransporter() {
  if (transporter) return transporter;

  console.log("Initializing Brevo transporter...");

  transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,

    auth: {
      user: getEnvOrThrow("BREVO_USER"),
      pass: getEnvOrThrow("BREVO_SMTP_KEY"),
    },
  });

  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const transport = getTransporter();

  return await transport.sendMail({
    from: process.env.BREVO_SENDER_EMAIL,
    to,
    subject,
    text,
    html,
  });
}