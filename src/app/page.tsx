import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollExpandHero from "@/components/ScrollExpandHero";
import RoomsLive from "@/components/RoomsLive";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Amenities from "@/components/Amenities";
import Testimonials from "@/components/Testimonials";
import Link from "next/link";

const venues = [
  { name: "Front Lawn", size: "44,000 sq.ft", note: "Grand weddings under the open sky", img: "/media/gallery/Front-Lawn-Jayamahal-Palace.jpeg" },
  { name: "Convention Centre & Lawn", size: "44,000 sq.ft", note: "Conferences at royal scale", img: "/media/gallery/Convention-Centre-Jayamahal.jpg" },
  { name: "Golden Lawn & Restaurant", size: "12,000 sq.ft", note: "Receptions with a golden hour", img: "/media/gallery/Golden-Lawn-Jayamahal.jpeg" },
  { name: "Darbar Hall", size: "2,500 sq.ft", note: "Air-conditioned heritage hall", img: "/media/gallery/darbar-hall-JMP.jpg" },
  { name: "Pool Side Lawn", size: "26,000 sq.ft", note: "Evenings by the Olympic pool", img: "/media/gallery/Pool-Side-Lawn-JMP.jpeg" },
];

const gallery = [
  "/media/gallery/p1.jpg",
  "/media/gallery/p2.jpg",
  "/media/gallery/p3.jpg",
  "/media/gallery/p4.jpg",
  "/media/gallery/p5.jpg",
  "/media/gallery/p6.jpg",
];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <ScrollExpandHero
          mediaSrc="/media/palace.mp4"
          posterSrc="/media/palace-poster.jpg"
          bgImageSrc="/media/palace-aerial.jpg"
          title="Jaya Mahal"
          kicker="Bengaluru · Est. in a royal past"
          scrollToExpand="Scroll to enter the palace"
        >
          {/* ── Heritage ─────────────────────────────────── */}
          <section id="heritage" className="mx-auto max-w-4xl px-5 py-24 text-center">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">
                The Palace
              </p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                Nineteen acres of heritage,
                <br />
                <span className="text-gold-gradient">in the heart of Bengaluru</span>
              </h2>
              <div className="gold-rule mx-auto my-8 w-40" />
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--jm-muted)]">
                Jaya Mahal is not luxury replicated — it is heritage preserved. Colonial
                architecture, turreted towers and oxblood balconies rise over lawns that have
                hosted royalty for generations. Minutes from Cantonment station, a world away
                from the city.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  ["19", "acres of gardens"],
                  ["5", "royal venues"],
                  ["500+", "vehicle parking"],
                  ["24/7", "palace service"],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-lg border border-[var(--jm-border)] bg-[var(--jm-surface)] p-6">
                    <p className="font-display text-3xl font-semibold text-[var(--jm-gold-soft)]">{n}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--jm-muted)]">{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ── Rooms ────────────────────────────────────── */}
          <section id="rooms" className="mx-auto max-w-6xl px-5 py-24">
            <Reveal className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">Stay</p>
              <h2 className="font-display mt-4 text-4xl font-semibold md:text-5xl">
                Rooms & Suites
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--jm-muted)]">
                Pick your dates — availability is live from the palace registers. Book direct
                and pay securely online.
              </p>
            </Reveal>
            <RoomsLive />
            <div className="mt-12 text-center">
              <Link href="/rooms" className="btn-ghost">
                View all rooms & book
              </Link>
            </div>
          </section>

          {/* ── Venues ───────────────────────────────────── */}
          <section id="venues" className="border-y border-[var(--jm-border)] bg-[#14120e99] py-24">
            <div className="mx-auto max-w-6xl px-5">
              <Reveal className="mb-12 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">Celebrate</p>
                <h2 className="font-display mt-4 text-4xl font-semibold md:text-5xl">
                  Venues of a royal scale
                </h2>
              </Reveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {venues.map((v, i) => (
                  <Reveal key={v.name} delay={i * 0.06}>
                    <TiltCard className="h-full">
                      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--jm-border)] bg-[var(--jm-bg)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={v.img} alt={v.name} className="h-48 w-full object-cover" loading="lazy" />
                        <div className="p-7">
                          <p className="font-display text-xl font-semibold">{v.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--jm-gold)]">
                            {v.size}
                          </p>
                          <p className="mt-3 text-sm text-[var(--jm-muted)]">{v.note}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
                <Reveal delay={0.3}>
                  <div className="flex h-full flex-col items-start justify-center rounded-xl border border-dashed border-[#c9a22766] p-7">
                    <p className="font-display text-xl font-semibold text-[var(--jm-gold-soft)]">
                      Planning an event?
                    </p>
                    <p className="mt-2 text-sm text-[var(--jm-muted)]">
                      Weddings, launches, conventions — our team will craft it.
                    </p>
                    <a href="tel:+919972033221" className="btn-gold mt-5 !px-5 !py-2.5">
                      Call the palace
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── Amenities ────────────────────────────────── */}
          <Amenities />

          {/* ── Testimonials ─────────────────────────────── */}
          <Testimonials />

          {/* ── Gallery ──────────────────────────────────── */}
          <section id="gallery" className="mx-auto max-w-6xl px-5 py-24">
            <Reveal className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">Witness</p>
              <h2 className="font-display mt-4 text-4xl font-semibold md:text-5xl">The grounds</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {gallery.map((src, i) => (
                <Reveal key={src} delay={i * 0.05}>
                  <div className="group overflow-hidden rounded-lg border border-[var(--jm-border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Jaya Mahal Palace view ${i + 1}`}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── CTA ──────────────────────────────────────── */}
          <section className="relative overflow-hidden py-28 text-center">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: "url(/media/palace-poster.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--jm-bg)] via-transparent to-[var(--jm-bg)]" />
            <Reveal className="relative">
              <h2 className="font-display text-4xl font-semibold md:text-6xl">
                Your royal chapter <span className="text-gold-gradient">awaits</span>
              </h2>
              <Link href="/rooms" className="btn-gold mt-10 !px-10 !py-4">
                Book your stay
              </Link>
            </Reveal>
          </section>
        </ScrollExpandHero>
      </main>
      <Footer />
    </>
  );
}
