"use client";

import { useState } from "react";
import useSWR from "swr";
import AdminShell from "../AdminShell";
import { Loader2, Plus, Save } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

type Room = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceInr: number;
  maxGuests: number;
  sizeSqft: number;
  totalUnits: number;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

function RoomEditor({ room, onSaved }: { room: Room; onSaved: () => void }) {
  const [r, setR] = useState(room);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/rooms/${room.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: r.name,
        tagline: r.tagline,
        description: r.description,
        priceInr: r.priceInr,
        maxGuests: r.maxGuests,
        sizeSqft: r.sizeSqft,
        totalUnits: r.totalUnits,
        imageUrl: r.imageUrl,
        featured: r.featured,
        active: r.active,
        sortOrder: r.sortOrder,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSaved();
  }

  return (
    <div className={`rounded-xl border bg-[var(--jm-surface)] p-6 ${r.active ? "border-[var(--jm-border)]" : "border-red-900/50 opacity-80"}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <input className="input-jm !w-auto flex-1 font-display !text-lg" value={r.name}
          onChange={(e) => setR({ ...r, name: e.target.value })} aria-label="Room name" />
        <label className="flex cursor-pointer items-center gap-2 text-xs">
          <input type="checkbox" checked={r.active} onChange={(e) => setR({ ...r, active: e.target.checked })}
            className="h-4 w-4 cursor-pointer accent-[var(--jm-gold)]" />
          <span className={r.active ? "text-emerald-400" : "text-red-400"}>
            {r.active ? "Live on site" : "Hidden / not bookable"}
          </span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label-jm">Price / night (₹)</label>
          <input type="number" min={0} className="input-jm" value={r.priceInr}
            onChange={(e) => setR({ ...r, priceInr: Number(e.target.value) })} />
        </div>
        <div>
          <label className="label-jm">Inventory (units)</label>
          <input type="number" min={0} className="input-jm" value={r.totalUnits}
            onChange={(e) => setR({ ...r, totalUnits: Number(e.target.value) })} />
        </div>
        <div>
          <label className="label-jm">Max guests</label>
          <input type="number" min={1} className="input-jm" value={r.maxGuests}
            onChange={(e) => setR({ ...r, maxGuests: Number(e.target.value) })} />
        </div>
        <div>
          <label className="label-jm">Size (sq.ft)</label>
          <input type="number" min={0} className="input-jm" value={r.sizeSqft}
            onChange={(e) => setR({ ...r, sizeSqft: Number(e.target.value) })} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-jm">Tagline</label>
          <input className="input-jm" value={r.tagline}
            onChange={(e) => setR({ ...r, tagline: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-jm">Image URL</label>
          <input className="input-jm" value={r.imageUrl}
            onChange={(e) => setR({ ...r, imageUrl: e.target.value })} />
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="label-jm">Description</label>
          <textarea rows={2} className="input-jm resize-y" value={r.description}
            onChange={(e) => setR({ ...r, description: e.target.value })} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--jm-muted)]">
          <input type="checkbox" checked={r.featured} onChange={(e) => setR({ ...r, featured: e.target.checked })}
            className="h-4 w-4 cursor-pointer accent-[var(--jm-gold)]" />
          Signature room badge
        </label>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-400">{error}</span>}
          {saved && <span className="text-xs text-emerald-400">Saved ✓</span>}
          <button className="btn-gold !px-5 !py-2 !text-xs" onClick={save} disabled={busy}>
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRooms() {
  const { data, mutate } = useSWR<{ rooms: Room[] }>("/api/admin/rooms", fetcher);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", slug: "", priceInr: 10000, totalUnits: 1, maxGuests: 2 });

  async function createRoom(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(j.error || "Could not create room");
      return;
    }
    setShowNew(false);
    setForm({ name: "", slug: "", priceInr: 10000, totalUnits: 1, maxGuests: 2 });
    mutate();
  }

  return (
    <AdminShell title="Rooms & Inventory">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[var(--jm-muted)]">
          Prices, inventory and visibility update the live site instantly. Set inventory to 0 or
          toggle a room hidden to mark it sold out.
        </p>
        <button className="btn-gold !px-4 !py-2 !text-xs" onClick={() => setShowNew(!showNew)}>
          <Plus size={14} /> Add room
        </button>
      </div>

      {showNew && (
        <form onSubmit={createRoom} className="mb-8 grid gap-4 rounded-xl border border-[#c9a2274c] bg-[var(--jm-surface)] p-6 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="label-jm" htmlFor="nr-name">Name</label>
            <input id="nr-name" required className="input-jm" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") })} />
          </div>
          <div>
            <label className="label-jm" htmlFor="nr-slug">Slug</label>
            <input id="nr-slug" required className="input-jm" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="label-jm" htmlFor="nr-price">Price / night (₹)</label>
            <input id="nr-price" required type="number" min={1} className="input-jm" value={form.priceInr}
              onChange={(e) => setForm({ ...form, priceInr: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label-jm" htmlFor="nr-units">Units</label>
            <input id="nr-units" required type="number" min={1} className="input-jm" value={form.totalUnits}
              onChange={(e) => setForm({ ...form, totalUnits: Number(e.target.value) })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-gold w-full !py-2.5" disabled={busy}>
              {busy && <Loader2 size={14} className="animate-spin" />} Create
            </button>
          </div>
          {error && <p className="text-xs text-red-400 lg:col-span-5">{error}</p>}
        </form>
      )}

      <div className="space-y-6">
        {(data?.rooms ?? []).map((room) => (
          <RoomEditor key={room.id} room={room} onSaved={mutate} />
        ))}
      </div>
    </AdminShell>
  );
}
