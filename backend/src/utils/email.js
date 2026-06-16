import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js to prefer IPv4 over IPv6
dns.setDefaultResultOrder("ipv4first");

function getEnvOrThrow(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  console.log("Initializing Gmail transporter...");

  const googleUser = getEnvOrThrow("GOOGLE_USER");

  const appPassword =
    process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD;

  if (!appPassword) {
    throw new Error(
      "Missing GMAIL_APP_PASSWORD or GMAIL_PASSWORD environment variable"
    );
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    auth: {
      user: googleUser,
      pass: appPassword,
    },

    tls: {
      rejectUnauthorized: false,
      family: 4, // Force IPv4
    },
  });

  console.log(`✓ Gmail transporter initialized for ${googleUser}`);

  return transporter;
}

/**
 * Send Email
 * @param {Object} params
 * @param {string|string[]} params.to
 * @param {string} params.subject
 * @param {string} params.text
 * @param {string} [params.html]
 */
export async function sendMail({ to, subject, text, html }) {
  if (!to) {
    throw new Error("sendMail: 'to' is required");
  }

  if (!subject) {
    throw new Error("sendMail: 'subject' is required");
  }

  if (!text && !html) {
    throw new Error("sendMail: either 'text' or 'html' is required");
  }

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

    console.log("Verifying SMTP connection...");
    await transport.verify();

    console.log("✓ SMTP verified successfully");

    console.log("Sending email...");
    const result = await transport.sendMail(mail);

    console.log("✓ Email sent successfully");
    console.log("Message ID:", result.messageId);
    console.log("Accepted:", result.accepted);
    console.log("Rejected:", result.rejected);

    return result;
  } catch (error) {
    console.error(`✗ Failed to send email to ${to}`);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Full Error:", error);

    throw error;
  }
}