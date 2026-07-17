"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

/** Shared check-in/check-out/guests bar. Emits ISO date strings (yyyy-mm-dd). */
export type Stay = { checkIn: string; checkOut: string; guests: number };

export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function parseDateStr(str: string): Date | null {
  if (!str) return null;
  const d = parseISO(str);
  return isValid(d) ? d : null;
}

export default function StayPicker({
  stay,
  onChange,
  compact = false,
}: {
  stay: Stay;
  onChange: (s: Stay) => void;
  compact?: boolean;
}) {
  const checkInDate = parseDateStr(stay.checkIn);
  const checkOutDate = parseDateStr(stay.checkOut);

  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-3"}`}>
      <div className="relative">
        <label htmlFor="checkin" className="label-jm">
          Check-in
        </label>
        <div className="relative">
          <DatePicker
            id="checkin"
            selected={checkInDate}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="input-jm w-full !pr-10"
            onChange={(date: Date | null) => {
              if (!date) return;
              const checkIn = format(date, "yyyy-MM-dd");
              const checkOut = stay.checkOut && stay.checkOut > checkIn ? stay.checkOut : "";
              onChange({ ...stay, checkIn, checkOut });
            }}
          />
          <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--jm-muted)] pointer-events-none" />
        </div>
      </div>
      <div className="relative">
        <label htmlFor="checkout" className="label-jm">
          Check-out
        </label>
        <div className="relative">
          <DatePicker
            id="checkout"
            selected={checkOutDate}
            minDate={checkInDate || new Date()}
            dateFormat="yyyy-MM-dd"
            className="input-jm w-full !pr-10"
            onChange={(date: Date | null) => {
              if (!date) return;
              onChange({ ...stay, checkOut: format(date, "yyyy-MM-dd") });
            }}
          />
          <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--jm-muted)] pointer-events-none" />
        </div>
      </div>
      <div>
        <label htmlFor="guests" className="label-jm">
          Guests
        </label>
        <select
          id="guests"
          className="input-jm cursor-pointer w-full"
          value={stay.guests}
          onChange={(e) => onChange({ ...stay, guests: Number(e.target.value) })}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
