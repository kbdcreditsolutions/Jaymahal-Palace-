"use client";

/** Shared check-in/check-out/guests bar. Emits ISO date strings (yyyy-mm-dd). */
export type Stay = { checkIn: string; checkOut: string; guests: number };

export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
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
  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-3"}`}>
      <div>
        <label htmlFor="checkin" className="label-jm">
          Check-in
        </label>
        <input
          id="checkin"
          type="date"
          className="input-jm [color-scheme:dark]"
          min={todayISO()}
          value={stay.checkIn}
          onChange={(e) => {
            const checkIn = e.target.value;
            const checkOut = stay.checkOut && stay.checkOut > checkIn ? stay.checkOut : "";
            onChange({ ...stay, checkIn, checkOut });
          }}
        />
      </div>
      <div>
        <label htmlFor="checkout" className="label-jm">
          Check-out
        </label>
        <input
          id="checkout"
          type="date"
          className="input-jm [color-scheme:dark]"
          min={stay.checkIn || todayISO(1)}
          value={stay.checkOut}
          onChange={(e) => onChange({ ...stay, checkOut: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="guests" className="label-jm">
          Guests
        </label>
        <select
          id="guests"
          className="input-jm cursor-pointer"
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
