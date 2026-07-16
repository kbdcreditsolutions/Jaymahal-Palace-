import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Booking Confirmation · Jaya Mahal Palace" };

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const fmt = (d: Date) =>
  d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function BookingPage({ params }: { params: { ref: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { bookingRef: params.ref },
    include: { room: true, payment: true },
  });
  if (!booking) notFound();

  const confirmed = booking.status === "CONFIRMED" || booking.status === "CHECKED_IN";

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-xl px-5 pb-24 pt-36 text-center">
        {confirmed ? (
          <CheckCircle2 size={56} className="mx-auto text-emerald-400" />
        ) : (
          <Clock size={56} className="mx-auto text-[var(--jm-gold)]" />
        )}
        <h1 className="font-display mt-6 text-4xl font-semibold">
          {confirmed ? "Your stay is confirmed" : "Booking received"}
        </h1>
        <p className="mt-3 text-sm text-[var(--jm-muted)]">
          {confirmed
            ? "A confirmation has been recorded against your booking reference. We look forward to welcoming you to the palace."
            : "Your booking is reserved and awaiting payment confirmation."}
        </p>

        <div className="glass mx-auto mt-10 rounded-xl p-6 text-left text-sm">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-[var(--jm-muted)]">Booking reference</p>
          <p className="font-display mb-6 text-center text-3xl tracking-[0.2em] text-[var(--jm-gold-soft)]">
            {booking.bookingRef}
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Guest</span><span>{booking.guestName}</span></div>
            <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Room</span><span>{booking.room.name}</span></div>
            <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Check-in</span><span>{fmt(booking.checkIn)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Check-out</span><span>{fmt(booking.checkOut)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Guests</span><span>{booking.guests}</span></div>
            <div className="gold-rule my-3" />
            <div className="flex justify-between font-semibold">
              <span>Amount</span>
              <span className="text-[var(--jm-gold-soft)]">{inr(booking.amountInr)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--jm-muted)]">Payment</span>
              <span className={booking.payment?.status === "PAID" ? "text-emerald-400" : "text-[var(--jm-gold)]"}>
                {booking.payment?.status ?? "PENDING"}
              </span>
            </div>
          </div>
        </div>

        <Link href="/" className="btn-ghost mt-10">Return to the palace</Link>
      </main>
      <Footer />
    </>
  );
}
