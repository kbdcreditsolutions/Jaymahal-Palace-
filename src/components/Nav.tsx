"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#heritage", label: "The Palace" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/#venues", label: "Venues" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-wide text-[var(--jm-ivory)]">
            Jaya Mahal
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--jm-gold)]">
            Palace
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--jm-muted)] transition hover:text-[var(--jm-gold-soft)]"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/rooms" className="btn-gold !px-5 !py-2.5">
            Book Now
          </Link>
        </nav>

        <button
          className="cursor-pointer p-2 text-[var(--jm-ivory)] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[var(--jm-border)] px-5 pb-6 pt-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm uppercase tracking-[0.18em] text-[#f5f0e6e6]"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/rooms" onClick={() => setOpen(false)} className="btn-gold mt-3 w-full">
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}
