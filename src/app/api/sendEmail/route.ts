import nodemailer from "nodemailer";

const emailBcc = ["geraldberongoy04@gmail.com", "daguinotaserwin5@gmail.com"];
const emailCc = ["salesrhandie@gmail.com"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const file = formData.get("file") as Blob;

    if (!email || !file) {
      return new Response(
        JSON.stringify({ message: "Email and file required" }),
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      cc: emailCc.join(", ") || "",
      bcc: emailBcc.join(", ") || "",
      subject: "GDG Photobooth",
      text: "Here is your photostrip!",
      attachments: [
        {
          filename: "photostrip.jpg",
          content: buffer,
        },
      ],
    });

    return new Response(JSON.stringify({ message: "Email sent!" }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Failed to send email", error: err }),
      {
        status: 500,
      }
    );
  }
}
