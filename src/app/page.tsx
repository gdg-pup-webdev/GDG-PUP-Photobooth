import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="landing">
        <h1 style={{ fontSize: 32, margin: 0 }}>Polaroid Photobooth</h1>
        <p style={{ maxWidth: 680 }}>
          A single-template polaroid photostrip — three shots, filters,
          stickers, download or email as attachment. Frame template:{" "}
          <code>public/frame.png</code>
        </p>
        <Link href="/photobooth">
          <button style={{ padding: "12px 20px", borderRadius: 8 }}>
            Start Photobooth →
          </button>
        </Link>
        <small style={{ opacity: 0.7 }}>
          Free-tier friendly — runs in the browser and uses a simple SMTP server
          for email sending.
        </small>
      </section>
    </main>
  );
}
