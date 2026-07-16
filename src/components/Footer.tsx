import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[var(--jm-border)] bg-[var(--jm-surface)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold">Jaya Mahal Palace</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-[var(--jm-gold)]">
            Heritage Hotel · Bengaluru
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--jm-muted)]">
            Nineteen acres of colonial-era heritage in the heart of the city. Not luxury replicated
            — heritage preserved.
          </p>
        </div>

        <div className="space-y-4 text-sm text-[var(--jm-muted)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--jm-ivory)]">
            Find Us
          </p>
          <p className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--jm-gold)]" />
            1, Jayamahal Road, near Cantonment Railway Station, Bengaluru, Karnataka 560046
          </p>
          <p className="flex items-center gap-3">
            <Phone size={16} className="shrink-0 text-[var(--jm-gold)]" />
            <a href="tel:+919972033221" className="transition hover:text-[var(--jm-gold-soft)]">
              +91 99720 33221
            </a>
          </p>
          <p className="flex items-center gap-3">
            <Mail size={16} className="shrink-0 text-[var(--jm-gold)]" />
            <a
              href="mailto:reservations@jayamahalpalace.com"
              className="transition hover:text-[var(--jm-gold-soft)]"
            >
              reservations@jayamahalpalace.com
            </a>
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--jm-ivory)]">
            Explore
          </p>
          <div className="flex flex-col gap-2 text-[var(--jm-muted)]">
            <Link href="/rooms" className="transition hover:text-[var(--jm-gold-soft)]">
              Rooms & Suites
            </Link>
            <Link href="/#venues" className="transition hover:text-[var(--jm-gold-soft)]">
              Weddings & Venues
            </Link>
            <Link href="/#gallery" className="transition hover:text-[var(--jm-gold-soft)]">
              Gallery
            </Link>
            <Link href="/admin" className="transition hover:text-[var(--jm-gold-soft)]">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--jm-border)] py-5 text-center text-xs text-[#a89f8cb2]">
        © {new Date().getFullYear()} Jaya Mahal Palace, Bengaluru. All rights reserved.
      </div>
    </footer>
  );
}
