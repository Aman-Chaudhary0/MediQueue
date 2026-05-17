import nodemailer from "nodemailer";

const requiredEnv = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_USER",
];

function getEnvOrThrow(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  // Validate required environment variables once at startup.
  requiredEnv.forEach((name) => getEnvOrThrow(name));

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

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

  const transport = getTransporter();

  // Will throw if OAuth2 is misconfigured.
  return await transport.sendMail(mail);
}
