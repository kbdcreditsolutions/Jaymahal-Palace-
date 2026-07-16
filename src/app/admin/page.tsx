"use client";

import useSWR from "swr";
import Link from "next/link";
import AdminShell from "./AdminShell";
import { IndianRupee, DoorOpen, Users, AlertCircle } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

type Stats = {
  arrivalsToday: number;
  inHouse: number;
  pendingPayments: number;
  revenueInr: number;
  occupiedTonight: number;
  totalUnits: number;
  recentBookings: Array<{
    id: string;
    bookingRef: string;
    guestName: string;
    status: string;
    amountInr: number;
    checkIn: string;
    checkOut: string;
    room: { name: string };
    payment: { status: string } | null;
  }>;
};

const statusColor: Record<string, string> = {
  PENDING: "text-amber-400",
  CONFIRMED: "text-emerald-400",
  CANCELLED: "text-red-400",
  CHECKED_IN: "text-sky-400",
  CHECKED_OUT: "text-[var(--jm-muted)]",
};

export default function AdminDashboard() {
  const { data } = useSWR<Stats>("/api/admin/stats", fetcher, { refreshInterval: 10000 });

  const occupancy =
    data && data.totalUnits > 0 ? Math.round((data.occupiedTonight / data.totalUnits) * 100) : 0;

  const cards = [
    { label: "Occupancy tonight", value: data ? `${occupancy}%` : "—", sub: data ? `${data.occupiedTonight}/${data.totalUnits} rooms` : "", icon: DoorOpen },
    { label: "Arrivals today", value: data?.arrivalsToday ?? "—", sub: "confirmed check-ins", icon: Users },
    { label: "Booked revenue", value: data ? inr(data.revenueInr) : "—", sub: "confirmed bookings", icon: IndianRupee },
    { label: "Pending payments", value: data?.pendingPayments ?? "—", sub: "need follow-up", icon: AlertCircle },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-[var(--jm-border)] bg-[var(--jm-surface)] p-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--jm-muted)]">{c.label}</p>
              <c.icon size={16} className="text-[var(--jm-gold)]" />
            </div>
            <p className="font-display mt-3 text-3xl font-semibold text-[var(--jm-ivory)]">{c.value}</p>
            <p className="mt-1 text-xs text-[var(--jm-muted)]">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-[var(--jm-border)] bg-[var(--jm-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--jm-border)] px-6 py-4">
          <h2 className="font-display text-lg font-semibold">Recent bookings</h2>
          <Link href="/admin/bookings" className="text-xs uppercase tracking-widest text-[var(--jm-gold)] hover:text-[var(--jm-gold-soft)]">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-[var(--jm-muted)]">
                <th className="px-6 py-3">Ref</th>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Stay</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentBookings ?? []).map((b) => (
                <tr key={b.id} className="border-t border-[#c9a2271c]">
                  <td className="px-6 py-3 font-mono text-xs text-[var(--jm-gold-soft)]">{b.bookingRef}</td>
                  <td className="px-4 py-3">{b.guestName}</td>
                  <td className="px-4 py-3 text-[var(--jm-muted)]">{b.room.name}</td>
                  <td className="px-4 py-3 text-xs text-[var(--jm-muted)]">
                    {b.checkIn.slice(0, 10)} → {b.checkOut.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">{inr(b.amountInr)}</td>
                  <td className={`px-4 py-3 text-xs font-semibold ${statusColor[b.status] ?? ""}`}>{b.status}</td>
                  <td className={`px-6 py-3 text-xs ${b.payment?.status === "PAID" ? "text-emerald-400" : "text-amber-400"}`}>
                    {b.payment?.status ?? "—"}
                  </td>
                </tr>
              ))}
              {data && data.recentBookings.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-[var(--jm-muted)]">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
