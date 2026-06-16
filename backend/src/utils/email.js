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

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });

  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  try {
    const transport = getTransporter();

    console.log("Attempting to send email...");

    const result = await transport.sendMail({
      from: process.env.BREVO_SENDER_EMAIL,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", result.messageId);
    console.log("Response:", result.response);

    return result;
  } catch (error) {
    console.error("❌ Brevo Error:", error);
    throw error;
  }
}