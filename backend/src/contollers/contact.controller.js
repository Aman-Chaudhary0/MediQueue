import { sendMail } from "../utils/email.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || typeof name !== "string") {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!phone || typeof phone !== "string") {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }
    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Get admin email from environment
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return res.status(500).json({ success: false, message: "Admin email not configured" });
    }

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin-top: 0;">New Contact Form Submission</h2>
          <p style="color: #666; margin-bottom: 20px;">You have received a new message from the contact form.</p>
        </div>

        <div style="background-color: #f0f5ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-top: 0;">Contact Information</h3>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
        </div>

        <div style="background-color: #fafafa; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
          <h3 style="color: #047857; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; color: #999; font-size: 12px;">
          <p>This message was sent from Medi-Queue Contact Form</p>
          <p>Received on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Send email to admin
    await sendMail({
      to: adminEmail,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    // Optionally send confirmation email to user
    const userConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin-top: 0;">Thank You for Contacting Us</h2>
          <p style="color: #666; margin-bottom: 20px;">We have received your message and will get back to you soon.</p>
        </div>

        <div style="background-color: #f0f5ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-top: 0;">Your Message Summary</h3>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Message:</strong></p>
          <p style="line-height: 1.6; white-space: pre-wrap; margin: 10px 0;">${message}</p>
        </div>

        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
          <p style="color: #047857; margin: 0;">Our team will review your message and respond shortly.</p>
        </div>
      </div>
    `;

    await sendMail({
      to: email,
      subject: "We received your message - Medi-Queue",
      text: `Thank you for contacting us. We have received your message and will get back to you soon.`,
      html: userConfirmationHtml,
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We will contact you soon!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send message. Please try again.",
    });
  }
};
