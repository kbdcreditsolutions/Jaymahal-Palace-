import Reveal from "@/components/Reveal";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rukmani Ramaswamy",
    location: "India",
    text: "We conducted a wedding. It was amidst greenery and lightings were lovely. Liked the place very much. The staff were warm. Mr. Varman, Mr. Ankur, Mr. Victor were very friendly and helped with whatever we needed. Lovely place amidst nature with birds chirping and cuckoos cooeing.",
    rating: 5,
  },
  {
    name: "Sybil Rose",
    location: "United Kingdom",
    text: "The atmosphere feels more like a peaceful resort than a busy hotel, making it a comfortable and relaxing place to stay. The heritage architecture is simply stunning.",
    rating: 5,
  },
  {
    name: "Anand M.",
    location: "India",
    text: "A beautiful heritage property with amazing lawns. The Darbar hall takes you back in time. Excellent hospitality and food. Highly recommended for stay and events.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[var(--jm-surface)] py-24 border-y border-[var(--jm-border)]">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">Guestbook</p>
          <h2 className="font-display mt-4 text-4xl font-semibold md:text-5xl">
            Words from our guests
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-xl border border-[var(--jm-border)] bg-[var(--jm-bg)] p-8">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[var(--jm-gold)] text-[var(--jm-gold)]" />
                  ))}
                </div>
                
                <blockquote className="flex-1 text-sm leading-relaxed text-[var(--jm-muted)]">
                  &quot;{t.text}&quot;
                </blockquote>
                
                <div className="mt-8 pt-6 border-t border-[var(--jm-border)]">
                  <p className="font-display text-lg font-semibold text-[var(--jm-gold-soft)]">{t.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--jm-muted)]">{t.location}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
