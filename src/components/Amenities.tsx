import { Waves, Dumbbell, Utensils, ParkingCircle, Bed, Briefcase, Leaf, Heart } from "lucide-react";
import Reveal from "./Reveal";

const amenities = [
  { name: "Swimming Pool", desc: "Enjoy a refreshing dip in our outdoor swimming pool, set amidst lush gardens for a tranquil escape.", icon: Waves },
  { name: "Gym", desc: "Stay fit and active at our state-of-the-art fitness center, equipped with the latest exercise machines.", icon: Dumbbell },
  { name: "Gallops Restaurant (Pure Veg)", desc: "Experience a dining delight at Gallops restaurant, where we serve the most exotic pure vegetarian food.", icon: Utensils },
  { name: "Lawn Area with Parking", desc: "A well-maintained lawn area is the green heart of any outdoor space, offering a refreshing and serene retreat.", icon: ParkingCircle },
  { name: "Where Comfort Meets Style", desc: "Experience the ultimate comfort with rooms thoughtfully designed to blend elegance and relaxation.", icon: Bed },
  { name: "Business Centre", desc: "High-speed WiFi throughout the palace and a fully equipped business centre for your professional needs.", icon: Briefcase },
  { name: "Lawn & Gardens", desc: "19 acres of meticulously maintained heritage gardens, perfect for a morning stroll or evening tea.", icon: Leaf },
  { name: "Enjoy Every Moment", desc: "Enjoy every second of your stay with bespoke services and unparalleled hospitality.", icon: Heart },
];

export default function Amenities() {
  return (
    <section id="amenities" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal className="mb-12 text-center">
        <div className="flex items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] text-[var(--jm-gold)]">
          <span className="h-[1px] w-8 bg-[var(--jm-gold)]"></span>
          Premium Amenities
          <span className="h-[1px] w-8 bg-[var(--jm-gold)]"></span>
        </div>
        <h2 className="font-display mt-4 text-4xl font-semibold md:text-5xl">
          Amenities That We Offer for You
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--jm-muted)]">
          Stunning Venues and Bespoke Services for Unforgettable Events and Weddings
        </p>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {amenities.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.05} className="h-full">
            <div className="flex h-full flex-col items-center rounded-xl bg-[var(--jm-surface)] p-8 text-center border border-[var(--jm-border)] transition-transform hover:-translate-y-1">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--jm-gold)] bg-[var(--jm-bg)] text-[var(--jm-gold)]">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{item.name}</h3>
              <p className="text-sm text-[var(--jm-muted)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
