import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RoomsLive from "@/components/RoomsLive";

export const metadata = {
  title: "Rooms & Suites · Jaya Mahal Palace",
};

export default function RoomsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">Stay</p>
          <h1 className="font-display mt-4 text-4xl font-semibold md:text-6xl">Rooms & Suites</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--jm-muted)]">
            Choose your dates to see live availability, then book and pay securely — Razorpay
            protected, confirmed instantly.
          </p>
        </div>
        <RoomsLive />
      </main>
      <Footer />
    </>
  );
}
