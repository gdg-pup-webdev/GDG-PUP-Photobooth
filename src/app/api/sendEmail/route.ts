import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, image } = body;

    if (!email || !image) {
      return new Response(
        JSON.stringify({ message: "Email and image are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER, // your email as sender
      to: email,
      subject: "GDG Photobooth",
      text: "Here is your photo strip from the booth!",
      attachments: [
        {
          filename: "photostrip.png",
          content: image.split("base64,")[1],
          encoding: "base64",
        },
      ],
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Failed to send email", error: err }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
