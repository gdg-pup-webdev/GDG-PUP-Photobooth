import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="landing">
        <Link href="/photobooth">Start Photobooth →</Link>
      </section>
    </main>
  );
}
