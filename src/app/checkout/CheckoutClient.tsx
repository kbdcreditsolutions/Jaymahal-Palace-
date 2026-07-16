"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Script from "next/script";
import { ShieldCheck, Loader2 } from "lucide-react";
import StayPicker, { Stay, todayISO } from "@/components/StayPicker";
import type { RoomWithAvailability } from "@/components/RoomsLive";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [stay, setStay] = useState<Stay>({
    checkIn: params.get("checkIn") || todayISO(1),
    checkOut: params.get("checkOut") || todayISO(2),
    guests: Number(params.get("guests")) || 2,
  });
  const [roomSlug, setRoomSlug] = useState(params.get("room") || "");
  const [guest, setGuest] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const datesValid = stay.checkIn && stay.checkOut && stay.checkOut > stay.checkIn;
  const { data } = useSWR<{ rooms: RoomWithAvailability[]; nights: number | null }>(
    datesValid ? `/api/availability?checkIn=${stay.checkIn}&checkOut=${stay.checkOut}` : null,
    fetcher,
    { refreshInterval: 15000 }
  );

  const rooms = data?.rooms ?? [];
  const room = rooms.find((r) => r.slug === roomSlug) ?? null;
  const nights = data?.nights ?? 0;
  const total = room && nights ? room.priceInr * nights : 0;
  const soldOut = room ? room.available !== null && room.available <= 0 : false;

  useEffect(() => {
    if (!roomSlug && rooms.length) setRoomSlug(rooms[0].slug);
  }, [rooms, roomSlug]);

  const canSubmit = useMemo(
    () =>
      !!room && !soldOut && datesValid && guest.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email) && guest.phone.trim().length >= 8 &&
      !submitting,
    [room, soldOut, datesValid, guest, submitting]
  );

  async function handlePay() {
    if (!room) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: room.slug,
          checkIn: stay.checkIn,
          checkOut: stay.checkOut,
          guests: stay.guests,
          guestName: guest.name,
          email: guest.email,
          phone: guest.phone,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not create booking");

      if (json.demo) {
        const v = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: json.bookingId }),
        });
        const vj = await v.json();
        if (!v.ok) throw new Error(vj.error || "Payment failed");
        router.push(`/booking/${json.bookingRef}`);
        return;
      }

      if (!window.Razorpay) throw new Error("Payment gateway failed to load. Please retry.");
      const rzp = new window.Razorpay({
        key: json.order.keyId,
        amount: json.order.amount,
        currency: "INR",
        name: "Jaya Mahal Palace",
        description: `${room.name} · ${nights} night${nights > 1 ? "s" : ""}`,
        image: "/media/palace-poster.jpg",
        order_id: json.order.id,
        prefill: { name: guest.name, email: guest.email, contact: guest.phone },
        theme: { color: "#C9A227" },
        handler: async (response: Record<string, string>) => {
          const v = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: json.bookingId, ...response }),
          });
          const vj = await v.json();
          if (v.ok) router.push(`/booking/${json.bookingRef}`);
          else {
            setError(vj.error || "Payment verification failed");
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">Reserve</p>
        <h1 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Complete your booking</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="glass rounded-xl p-6">
            <h2 className="font-display mb-5 text-xl font-semibold">1 · Your stay</h2>
            <StayPicker stay={stay} onChange={setStay} />
            <div className="mt-5">
              <label htmlFor="room" className="label-jm">Room</label>
              <select
                id="room"
                className="input-jm cursor-pointer"
                value={roomSlug}
                onChange={(e) => setRoomSlug(e.target.value)}
              >
                {rooms.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name} — {inr(r.priceInr)}/night
                    {r.available !== null ? (r.available > 0 ? ` (${r.available} left)` : " (sold out)") : ""}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="glass rounded-xl p-6">
            <h2 className="font-display mb-5 text-xl font-semibold">2 · Guest details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="label-jm">Full name</label>
                <input id="name" className="input-jm" placeholder="As on your ID"
                  value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="email" className="label-jm">Email</label>
                <input id="email" type="email" className="input-jm" placeholder="you@example.com"
                  value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} />
              </div>
              <div>
                <label htmlFor="phone" className="label-jm">Phone</label>
                <input id="phone" type="tel" className="input-jm" placeholder="+91 …"
                  value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} />
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-[#c9a2274c] bg-[var(--jm-surface)] p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-semibold">Summary</h2>
          {room ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={room.imageUrl} alt={room.name} className="mt-4 aspect-[3/2] w-full rounded-lg object-cover" />
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Room</span><span>{room.name}</span></div>
                <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Dates</span><span>{stay.checkIn} → {stay.checkOut}</span></div>
                <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Guests</span><span>{stay.guests}</span></div>
                <div className="flex justify-between"><span className="text-[var(--jm-muted)]">Rate</span><span>{inr(room.priceInr)} × {nights} night{nights > 1 ? "s" : ""}</span></div>
                {room.available !== null && (
                  <div className="flex justify-between">
                    <span className="text-[var(--jm-muted)]">Availability</span>
                    <span className={soldOut ? "text-red-400" : "text-emerald-400"}>
                      {soldOut ? "Sold out" : `${room.available} left — live`}
                    </span>
                  </div>
                )}
                <div className="gold-rule my-3" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-[var(--jm-gold-soft)]">{inr(total)}</span>
                </div>
              </div>

              {error && <p className="mt-4 rounded-md bg-red-950/60 px-3 py-2 text-xs text-red-300">{error}</p>}

              <button className="btn-gold mt-5 w-full" disabled={!canSubmit} onClick={handlePay}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? "Processing…" : soldOut ? "Sold out" : `Pay ${inr(total)}`}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--jm-muted)]">
                <ShieldCheck size={13} className="text-[var(--jm-gold)]" /> Secured by Razorpay
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-[var(--jm-muted)]">Select dates and a room to see your total.</p>
          )}
        </aside>
      </div>
    </>
  );
}
