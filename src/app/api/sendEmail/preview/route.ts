import { getEmailTemplate } from "../emailTemplate";

export async function GET() {
  const htmlContent = getEmailTemplate("preview@example.com");
  
  return new Response(htmlContent, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
