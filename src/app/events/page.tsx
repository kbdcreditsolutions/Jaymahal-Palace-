import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { CalendarCheck, Users, Phone } from "lucide-react";

const venues = [
  {
    id: "front-lawn",
    name: "Front Lawn",
    size: "44,000 sq.ft",
    capacity: "Up to 3,000 guests",
    desc: "A sprawling verdant expanse ideal for grand weddings, mega-events, and exhibitions under the open sky. Surrounded by heritage charm.",
    img: "/media/gallery/Front-Lawn-Jayamahal-Palace.jpeg",
  },
  {
    id: "convention-centre",
    name: "Convention Centre & Lawn",
    size: "44,000 sq.ft",
    capacity: "Up to 2,500 guests",
    desc: "A vast, versatile space combining a manicured lawn with a large covered area, perfect for large-scale corporate conferences, trade shows, and elaborate receptions.",
    img: "/media/gallery/Image-29-06-26-at-12.33-PM.png",
  },
  {
    id: "golden-lawn",
    name: "Golden Lawn & Restaurant",
    size: "12,000 sq.ft",
    capacity: "Up to 800 guests",
    desc: "An enchanting setting for medium-sized gatherings, evening cocktail parties, and elegant receptions bathed in a golden hour glow.",
    img: "/media/gallery/Golden-Lawn-Jayamahal.jpeg",
  },
  {
    id: "pool-side-lawn",
    name: "Pool Side Lawn",
    size: "26,000 sq.ft",
    capacity: "Up to 1,500 guests",
    desc: "Host unforgettable evenings by the Olympic-sized pool. This picturesque venue brings a refreshing ambiance to parties and pre-wedding celebrations.",
    img: "/media/gallery/Pool-Side-Lawn-JMP.jpeg",
  },
  {
    id: "darbar-hall",
    name: "Darbar Hall",
    size: "2,500 sq.ft",
    capacity: "Up to 200 guests",
    desc: "An air-conditioned heritage hall exuding colonial elegance. The perfect indoor venue for intimate weddings, corporate seminars, and private banquets.",
    img: "/media/gallery/darbar-hall-JMP.jpg",
  },
];

export const metadata = { title: "Events & Venues · Jaya Mahal Palace" };

export default function EventsPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20">
        <section className="bg-[var(--jm-surface)] py-20 border-b border-[var(--jm-border)]">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">
                <span className="h-[1px] w-8 bg-[var(--jm-gold)]"></span>
                Host With Us
                <span className="h-[1px] w-8 bg-[var(--jm-gold)]"></span>
              </div>
              <h1 className="font-display mt-4 text-5xl font-semibold md:text-6xl">
                Venues of a Royal Scale
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--jm-muted)]">
                From intimate heritage halls to sprawling 44,000 sq.ft lawns, Jaya Mahal Palace offers majestic settings for weddings, corporate conventions, and grand celebrations right in the heart of Bengaluru.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <a href="tel:+919972033221" className="btn-gold flex items-center gap-2">
                  <Phone size={16} /> Enquire Now
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24 space-y-24">
          {venues.map((v, i) => (
            <Reveal key={v.id} delay={0.1}>
              <div className={`flex flex-col gap-10 md:items-center ${i % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                <div className="flex-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.img} alt={v.name} className="rounded-xl border border-[var(--jm-border)] w-full object-cover aspect-[4/3] shadow-lg" loading="lazy" />
                </div>
                <div className="flex-1 space-y-5">
                  <h2 className="font-display text-3xl font-semibold md:text-4xl">{v.name}</h2>
                  
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--jm-gold-soft)] bg-[#1a1711] border border-[#c9a22733] px-3 py-1.5 rounded-full">
                      <CalendarCheck size={16} /> {v.size}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--jm-gold-soft)] bg-[#1a1711] border border-[#c9a22733] px-3 py-1.5 rounded-full">
                      <Users size={16} /> {v.capacity}
                    </div>
                  </div>

                  <p className="text-[var(--jm-muted)] leading-relaxed">
                    {v.desc}
                  </p>
                  
                  <div className="pt-2">
                    <a href="tel:+919972033221" className="btn-ghost inline-flex items-center gap-2 text-sm">
                      Request a quote
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
