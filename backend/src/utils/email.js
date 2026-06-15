import nodemailer from "nodemailer";

function getEnvOrThrow(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  console.log("Initializing Gmail transporter...");
  const googleUser = getEnvOrThrow("GOOGLE_USER");
  const appPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD;

  if (!appPassword) {
    throw new Error("Missing GMAIL_APP_PASSWORD or GMAIL_PASSWORD in .env");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: googleUser,
      pass: appPassword,
    },
  });

  console.log(`✓ Gmail transporter initialized for ${googleUser}`);
  return transporter;
}

/**
 * @param {object} params
 * @param {string|string[]} params.to
 * @param {string} params.subject
 * @param {string} params.text
 * @param {string} [params.html]
 * @returns {Promise<nodemailer.SentMessageInfo>}
 */
export async function sendMail({ to, subject, text, html }) {
  if (!to) throw new Error("sendMail: 'to' is required");
  if (!subject) throw new Error("sendMail: 'subject' is required");
  if (!text && !html) throw new Error("sendMail: either 'text' or 'html' is required");

  const mail = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    console.log(`Attempting to send email to ${to}...`);
    const transport = getTransporter();
    const result = await transport.sendMail(mail);
    console.log(`✓ Email sent successfully to ${to}`, result.messageId);
    return result;
  } catch (error) {
    console.error(`✗ Failed to send email to ${to}:`, error.message);
    throw error;
  }
}
