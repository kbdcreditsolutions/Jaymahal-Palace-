"use client";

import { useState } from "react";
import useSWR from "swr";
import AdminShell from "../AdminShell";
import { Link2, Copy, Check, Plus, Loader2 } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

type Booking = {
  id: string;
  bookingRef: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amountInr: number;
  status: string;
  source: string;
  room: { id: string; name: string };
  payment: { status: string; linkUrl: string | null; method: string } | null;
};

type Room = { id: string; name: string; priceInr: number };

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "CHECKED_IN", "CHECKED_OUT"];
const statusColor: Record<string, string> = {
  PENDING: "bg-amber-950 text-amber-300",
  CONFIRMED: "bg-emerald-950 text-emerald-300",
  CANCELLED: "bg-red-950 text-red-300",
  CHECKED_IN: "bg-sky-950 text-sky-300",
  CHECKED_OUT: "bg-zinc-800 text-zinc-400",
};

export default function AdminBookings() {
  const [filter, setFilter] = useState("");
  const { data, mutate } = useSWR<{ bookings: Booking[] }>(
    `/api/admin/bookings${filter ? `?status=${filter}` : ""}`,
    fetcher,
    { refreshInterval: 10000 }
  );
  const { data: roomsData } = useSWR<{ rooms: Room[] }>("/api/admin/rooms", fetcher);

  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState<string>("");
  const [copied, setCopied] = useState<string>("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    roomId: "",
    guestName: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    notes: "",
  });

  async function setStatus(id: string, status: string) {
    setBusy(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy("");
    mutate();
  }

  async function makeLink(id: string) {
    setBusy(id);
    setError("");
    const res = await fetch("/api/admin/payment-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id }),
    });
    const j = await res.json();
    setBusy("");
    if (!res.ok) {
      setError(j.error || "Could not create link");
      return;
    }
    mutate();
    if (j.linkUrl) copyLink(id, j.linkUrl);
  }

  function copyLink(id: string, url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  async function createBooking(e: React.FormEvent) {
    e.preventDefault();
    setBusy("new");
    setError("");
    const res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await res.json();
    setBusy("");
    if (!res.ok) {
      setError(j.error || "Could not create booking");
      return;
    }
    setShowNew(false);
    setForm({ roomId: "", guestName: "", phone: "", email: "", checkIn: "", checkOut: "", guests: 2, notes: "" });
    mutate();
  }

  return (
    <AdminShell title="Bookings">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("")}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${!filter ? "bg-[var(--jm-gold)] text-black" : "border border-[var(--jm-border)] text-[var(--jm-muted)] hover:text-[var(--jm-ivory)]"}`}>
            All
          </button>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${filter === s ? "bg-[var(--jm-gold)] text-black" : "border border-[var(--jm-border)] text-[var(--jm-muted)] hover:text-[var(--jm-ivory)]"}`}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
        <button className="btn-gold !px-4 !py-2 !text-xs" onClick={() => setShowNew(!showNew)}>
          <Plus size={14} /> New booking
        </button>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-950/60 px-4 py-2 text-sm text-red-300">{error}</p>}

      {showNew && (
        <form onSubmit={createBooking} className="mb-8 grid gap-4 rounded-xl border border-[#c9a2274c] bg-[var(--jm-surface)] p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label-jm" htmlFor="nb-room">Room</label>
            <select id="nb-room" required className="input-jm cursor-pointer" value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
              <option value="">Select room…</option>
              {(roomsData?.rooms ?? []).map((r) => (
                <option key={r.id} value={r.id}>{r.name} — {inr(r.priceInr)}/n</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-jm" htmlFor="nb-name">Guest name</label>
            <input id="nb-name" required className="input-jm" value={form.guestName}
              onChange={(e) => setForm({ ...form, guestName: e.target.value })} />
          </div>
          <div>
            <label className="label-jm" htmlFor="nb-phone">Phone</label>
            <input id="nb-phone" required className="input-jm" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label-jm" htmlFor="nb-email">Email (optional)</label>
            <input id="nb-email" type="email" className="input-jm" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label-jm" htmlFor="nb-in">Check-in</label>
            <input id="nb-in" required type="date" className="input-jm [color-scheme:dark]" value={form.checkIn}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
          </div>
          <div>
            <label className="label-jm" htmlFor="nb-out">Check-out</label>
            <input id="nb-out" required type="date" className="input-jm [color-scheme:dark]" value={form.checkOut}
              onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
          </div>
          <div>
            <label className="label-jm" htmlFor="nb-guests">Guests</label>
            <input id="nb-guests" type="number" min={1} max={10} className="input-jm" value={form.guests}
              onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-gold w-full !py-2.5" disabled={busy === "new"}>
              {busy === "new" && <Loader2 size={14} className="animate-spin" />} Create
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--jm-border)] bg-[var(--jm-surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-[var(--jm-muted)]">
              <th className="px-5 py-3.5">Ref</th>
              <th className="px-4 py-3.5">Guest</th>
              <th className="px-4 py-3.5">Room</th>
              <th className="px-4 py-3.5">Stay</th>
              <th className="px-4 py-3.5">Amount</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Payment</th>
              <th className="px-5 py-3.5">Collect</th>
            </tr>
          </thead>
          <tbody>
            {(data?.bookings ?? []).map((b) => (
              <tr key={b.id} className="border-t border-[#c9a2271c]">
                <td className="px-5 py-3">
                  <span className="font-mono text-xs text-[var(--jm-gold-soft)]">{b.bookingRef}</span>
                  <span className="block text-[10px] text-[var(--jm-muted)]">{b.source}</span>
                </td>
                <td className="px-4 py-3">
                  {b.guestName}
                  <span className="block text-[11px] text-[var(--jm-muted)]">{b.phone}</span>
                </td>
                <td className="px-4 py-3 text-[var(--jm-muted)]">{b.room.name}</td>
                <td className="px-4 py-3 text-xs text-[var(--jm-muted)]">
                  {b.checkIn.slice(0, 10)} → {b.checkOut.slice(0, 10)}
                </td>
                <td className="px-4 py-3">{inr(b.amountInr)}</td>
                <td className="px-4 py-3">
                  <select
                    value={b.status}
                    disabled={busy === b.id}
                    onChange={(e) => setStatus(b.id, e.target.value)}
                    className={`cursor-pointer rounded-full border-0 px-3 py-1 text-[11px] font-semibold ${statusColor[b.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                  </select>
                </td>
                <td className={`px-4 py-3 text-xs font-semibold ${b.payment?.status === "PAID" ? "text-emerald-400" : "text-amber-400"}`}>
                  {b.payment?.status ?? "—"}
                </td>
                <td className="px-5 py-3">
                  {b.payment?.status === "PAID" ? (
                    <span className="text-xs text-emerald-400">Collected</span>
                  ) : b.payment?.linkUrl ? (
                    <button onClick={() => copyLink(b.id, b.payment!.linkUrl!)}
                      className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--jm-gold)] hover:text-[var(--jm-gold-soft)]">
                      {copied === b.id ? <Check size={13} /> : <Copy size={13} />}
                      {copied === b.id ? "Copied!" : "Copy link"}
                    </button>
                  ) : (
                    <button onClick={() => makeLink(b.id)} disabled={busy === b.id}
                      className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--jm-gold)] hover:text-[var(--jm-gold-soft)] disabled:opacity-50">
                      {busy === b.id ? <Loader2 size={13} className="animate-spin" /> : <Link2 size={13} />}
                      Payment link
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data && data.bookings.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-[var(--jm-muted)]">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
