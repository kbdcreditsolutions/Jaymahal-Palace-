"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BedDouble, CalendarCheck2, LogOut, Crown } from "lucide-react";
import { ReactNode } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck2 },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
];

export default function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-[var(--jm-border)] bg-[var(--jm-surface)]">
        <Link href="/" className="flex items-center gap-2.5 border-b border-[var(--jm-border)] px-5 py-5">
          <Crown size={18} className="text-[var(--jm-gold)]" />
          <span className="font-display text-lg font-semibold">Jaya Mahal</span>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-[#c9a22726] text-[var(--jm-gold-soft)]"
                    : "text-[var(--jm-muted)] hover:bg-white/5 hover:text-[var(--jm-ivory)]"
                }`}
              >
                <n.icon size={16} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="flex cursor-pointer items-center gap-3 border-t border-[var(--jm-border)] px-6 py-4 text-sm text-[var(--jm-muted)] transition hover:text-red-400"
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <main className="ml-56 flex-1 p-8">
        <h1 className="font-display mb-8 text-3xl font-semibold">{title}</h1>
        {children}
      </main>
    </div>
  );
}
