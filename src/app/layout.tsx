import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Using Outfit as the primary font - it's very similar to Google Sans
// and is available on Google Fonts
const googleSans = Outfit({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GDG Photobooth | Google Developer Groups on Campus PUP",
  description: "Capture amazing photos at the GDG on Campus PUP event!",
  openGraph: {
    title: "GDG Photobooth | Google Developer Groups on Campus PUP",
    description: "Capture amazing photos at the GDG on Campus PUP event!",
    images: [
      {
        url: "/sample/sample4.webp",
        width: 1200,
        height: 630,
        alt: "GDG on Campus PUP Photobooth",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG Photobooth | Google Developer Groups on Campus PUP",
    description: "Capture amazing photos at the GDG on Campus PUP event!",
    images: ["/sample/sample4.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${googleSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-google-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
