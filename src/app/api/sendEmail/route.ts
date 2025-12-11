import nodemailer from "nodemailer";
import { getEmailTemplate } from "./emailTemplate";

const emailBcc = [
  "geraldberongoy04@gmail.com",
  "daguinotaserwin5@gmail.com",
  "salesrhandie@gmail.com",
];
const emailCc = ["gdgpup.technologydepartment@gmail.com"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const file = formData.get("file") as Blob;

    if (!email || !file) {
      return new Response(
        JSON.stringify({ message: "Email and file are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate environment variables
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.error("Missing SMTP configuration");
      return new Response(
        JSON.stringify({ message: "Email service is not configured properly" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    console.log("File details:", {
      size: buffer.length,
      type: file.type,
      hasContent: buffer.length > 0,
    });

    if (buffer.length === 0) {
      console.error("File buffer is empty");
      return new Response(
        JSON.stringify({ message: "The photo file is empty or invalid" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Generate the HTML email template
    const htmlContent = getEmailTemplate(email);

    const mailOptions = {
      from: `"GDG Photobooth" <${process.env.SMTP_USER}>`,
      to: email,
      cc: emailCc.join(", ") || "",
      bcc: emailBcc.join(", ") || "",
      subject: "Your GDG Photobooth Photo is Here!",
      text: "Thanks for visiting the GDG on Campus PUP Photobooth! Your photostrip is attached to this email.",
      html: htmlContent,
      attachments: [
        {
          filename: "gdg-photostrip.jpg",
          content: buffer,
          contentType: "image/jpeg",
        },
      ],
    };

    console.log("Sending email with attachment size:", buffer.length, "bytes");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error sending email:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        message: "Failed to send email. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
