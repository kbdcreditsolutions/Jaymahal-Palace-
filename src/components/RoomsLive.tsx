"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Users, Maximize, BadgeCheck, Ban } from "lucide-react";
import TiltCard from "./TiltCard";
import Reveal from "./Reveal";
import StayPicker, { Stay, todayISO } from "./StayPicker";

export type RoomWithAvailability = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceInr: number;
  maxGuests: number;
  sizeSqft: number;
  totalUnits: number;
  amenities: string[];
  imageUrl: string;
  featured: boolean;
  available: number | null;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function RoomsLive({ limit }: { limit?: number }) {
  const [stay, setStay] = useState<Stay>({
    checkIn: todayISO(1),
    checkOut: todayISO(2),
    guests: 2,
  });

  const datesValid = stay.checkIn && stay.checkOut && stay.checkOut > stay.checkIn;
  const query = datesValid ? `?checkIn=${stay.checkIn}&checkOut=${stay.checkOut}` : "";
  const { data, isLoading } = useSWR<{ rooms: RoomWithAvailability[] }>(
    `/api/availability${query}`,
    fetcher,
    { refreshInterval: 15000 }
  );

  const rooms = (data?.rooms ?? []).slice(0, limit);

  return (
    <div>
      <div className="glass mx-auto mb-12 max-w-3xl rounded-xl p-5">
        <StayPicker stay={stay} onChange={setStay} compact />
        <p className="mt-3 text-center text-xs text-[var(--jm-muted)]">
          Live availability — updates in real time as rooms are booked.
        </p>
      </div>

      {isLoading && !data && (
        <p className="py-12 text-center text-sm text-[var(--jm-muted)]">Checking the palace registers…</p>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {rooms.map((room, i) => {
          const soldOut = room.available !== null && room.available <= 0;
          return (
            <Reveal key={room.id} delay={i * 0.08}>
              <TiltCard className="group h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--jm-border)] bg-[var(--jm-surface)]">
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 flex gap-2">
                      {room.featured && (
                        <span className="rounded-full bg-[var(--jm-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                          Signature
                        </span>
                      )}
                    </div>
                    <div className="absolute right-4 top-4">
                      {room.available === null ? null : soldOut ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-[var(--jm-oxblood)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                          <Ban size={11} /> Sold out
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-900/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">
                          <BadgeCheck size={11} /> {room.available} left
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl font-semibold">{room.name}</h3>
                      <p className="whitespace-nowrap text-right">
                        <span className="font-display text-xl text-[var(--jm-gold-soft)]">
                          {inr(room.priceInr)}
                        </span>
                        <span className="block text-[10px] uppercase tracking-widest text-[var(--jm-muted)]">
                          per night
                        </span>
                      </p>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#c9a227cc]">
                      {room.tagline}
                    </p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--jm-muted)]">
                      {room.description}
                    </p>

                    <div className="mt-4 flex gap-5 text-xs text-[var(--jm-muted)]">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-[var(--jm-gold)]" /> Up to {room.maxGuests}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Maximize size={14} className="text-[var(--jm-gold)]" /> {room.sizeSqft} sq.ft
                      </span>
                    </div>

                    <div className="mt-6 flex gap-3 pt-1">
                      {soldOut ? (
                        <button disabled className="btn-ghost flex-1 !cursor-not-allowed opacity-50">
                          Sold out for these dates
                        </button>
                      ) : (
                        <Link
                          href={`/checkout?room=${room.slug}&checkIn=${stay.checkIn}&checkOut=${stay.checkOut}&guests=${stay.guests}`}
                          className="btn-gold flex-1"
                        >
                          Book this room
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
