import Reveal from "@/components/Reveal";
import Image from "next/image";
import { MapPin, Phone, Mail, AtSign } from "lucide-react";

export default function VenuesPage() {
  return (
    <main className="min-h-screen bg-[var(--jm-bg)] pt-24 pb-0">
      {/* Perfect For Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <h1 className="font-display text-4xl font-semibold md:text-5xl text-[var(--jm-primary)] mb-12">
              Perfect For
            </h1>
          </Reveal>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Reveal delay={0.1}>
              <div className="flex flex-col items-center">
                <div className="aspect-[4/3] w-full bg-[var(--jm-border)] rounded-md mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--jm-muted)]">
                    <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  </div>
                </div>
                <h3 className="font-display text-2xl mb-2 text-[var(--jm-primary)]">Weddings & Receptions</h3>
                <p className="text-[var(--jm-muted)] text-sm">Grand baraats, open-air pheras and receptions with full decor freedom.</p>
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="flex flex-col items-center">
                <div className="aspect-[4/3] w-full bg-[var(--jm-border)] rounded-md mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--jm-muted)]">
                    <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  </div>
                </div>
                <h3 className="font-display text-2xl mb-2 text-[var(--jm-primary)]">Corporate Events</h3>
                <p className="text-[var(--jm-muted)] text-sm">Product launches, offsites and gala dinners with a heritage backdrop.</p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col items-center">
                <div className="aspect-[4/3] w-full bg-[var(--jm-border)] rounded-md mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--jm-muted)]">
                    <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  </div>
                </div>
                <h3 className="font-display text-2xl mb-2 text-[var(--jm-primary)]">Private Celebrations</h3>
                <p className="text-[var(--jm-muted)] text-sm">Milestone birthdays, anniversaries and family gatherings at scale.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Venue Gallery */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold md:text-5xl text-[var(--jm-primary)] mb-12">
              Venue Gallery
            </h2>
          </Reveal>
          
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-1 aspect-[4/3] relative">
                 <Image src="/media/gallery/p2.jpg" alt="Gallery 1" fill className="object-cover" />
              </div>
              <div className="col-span-1 md:col-span-1 aspect-[4/3] relative">
                 <Image src="/media/gallery/g3.5.jpg" alt="Gallery 2" fill className="object-cover" />
              </div>
              <div className="col-span-2 md:col-span-1 aspect-[4/3] relative">
                 <Image src="/media/palace-aerial.jpg" alt="Gallery 3" fill className="object-cover" />
              </div>
              <div className="col-span-2 md:col-span-1 aspect-[4/3] relative">
                 <Image src="/media/gallery/p5.jpg" alt="Gallery 4" fill className="object-cover" />
              </div>
              
              <div className="col-span-2 md:col-span-2 aspect-[16/9] relative">
                 <Image src="/media/gallery/g6.5.jpg" alt="Gallery 5" fill className="object-cover" />
              </div>
              <div className="col-span-2 md:col-span-2 aspect-[16/9] relative">
                 <Image src="/media/gallery/p6.jpg" alt="Gallery 6" fill className="object-cover" />
              </div>
              
              <div className="col-span-2 md:col-span-1 aspect-[4/3] relative">
                 <Image src="/media/gallery/Golden-Lawn-Jayamahal.jpeg" alt="Gallery 7" fill className="object-cover" />
              </div>
              <div className="col-span-2 md:col-span-1 aspect-[4/3] relative">
                 <Image src="/media/gallery/p1.jpg" alt="Gallery 8" fill className="object-cover" />
              </div>
              <div className="col-span-2 md:col-span-2 aspect-[2/1] relative">
                 <Image src="/media/gallery/Pool-Side-Lawn-JMP.jpeg" alt="Gallery 9" fill className="object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* More Venues */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold md:text-4xl text-[var(--jm-primary)] mb-12">
              More Venues at Jayamahal
            </h2>
          </Reveal>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Reveal delay={0.1}>
              <div className="flex flex-col items-center">
                <div className="aspect-[4/3] w-full mb-6 relative overflow-hidden">
                  <Image src="/media/gallery/Convention-Centre-Jayamahal.jpg" alt="Convention Hall with Lawn" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-display text-xl mb-2 text-[var(--jm-primary)]">Convention Hall with Lawn</h3>
                <p className="text-[var(--jm-muted)] text-sm">17,000 sq ft hall adjoining a 27,000 sq ft lawn. 1,000 seated / 1,500 floating.</p>
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="flex flex-col items-center">
                <div className="aspect-[4/3] w-full mb-6 relative overflow-hidden">
                  <Image src="/media/gallery/Pool-Side-Lawn-JMP.jpeg" alt="Poolside Lawn" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-display text-xl mb-2 text-[var(--jm-primary)]">Poolside Lawn</h3>
                <p className="text-[var(--jm-muted)] text-sm">16,000 sq ft lawn with 10,000 sq ft poolside. 570 seated / 700 floating.</p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col items-center">
                <div className="aspect-[4/3] w-full mb-6 relative overflow-hidden">
                  <Image src="/media/gallery/darbar-hall-JMP.jpg" alt="Darbar Hall" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-display text-xl mb-2 text-[var(--jm-primary)]">Darbar Hall</h3>
                <p className="text-[var(--jm-muted)] text-sm">3,000 sq ft air-conditioned hall plus 3,500 sq ft covered area. Up to 150 guests.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Getting Here Map Section */}
      <section className="py-24 bg-[var(--jm-surface)] border-t border-[var(--jm-border)]">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <Reveal className="h-full min-h-[350px]">
              <div className="w-full h-full rounded-md overflow-hidden border border-[var(--jm-border)] shadow-sm">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.485123964923!2d77.59560441482236!3d12.996763490838186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae164ee1e2a075%3A0x9d4b003a2fb0b8c!2sJayamahal%20Palace%20Hotel!5e0!3m2!1sen!2sin!4v1689255601243!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '350px' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Reveal>
            
            <Reveal delay={0.2} className="flex flex-col justify-center">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--jm-primary)] mb-8">
                Getting Here
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[var(--jm-gold)] shrink-0 mt-1" />
                  <p className="text-[var(--jm-primary)] text-sm leading-relaxed">
                    1, Jayamahal Main Rd, near Cantonment Railway Station Rd,<br/>
                    Bengaluru 560046
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-[var(--jm-gold)] shrink-0" />
                  <p className="text-[var(--jm-primary)] text-sm">
                    +91 70223 88928 / +91 99720 33221
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-[var(--jm-gold)] shrink-0" />
                  <p className="text-[var(--jm-primary)] text-sm">
                    jayamahalpalace@hghhotels.com
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <AtSign className="w-5 h-5 text-[var(--jm-gold)] shrink-0" />
                  <p className="text-[var(--jm-primary)] text-sm">
                    @jayamahalpalacehotelbangalore
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
