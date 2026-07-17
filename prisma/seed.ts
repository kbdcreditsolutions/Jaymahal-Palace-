import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const rooms = [
  {
    slug: "heritage-room",
    name: "Heritage Room",
    tagline: "Colonial charm, garden views",
    description:
      "Elegant rooms in the palace wings with four-poster inspired beds, teak furnishings and views over the heritage gardens. A quiet retreat wrapped in 19 acres of green.",
    priceInr: 8500,
    maxGuests: 2,
    sizeSqft: 380,
    totalUnits: 10,
    amenities: JSON.stringify(["King bed", "Garden view", "24/7 room service", "High-speed WiFi", "Rain shower", "Smart TV"]),
    imageUrl: "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_17_8.jpg",
    images: ["https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_17_8.jpg", "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_19_10.jpg", "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_21_6-1.jpg"],
    featured: false,
    sortOrder: 1,
  },
  {
    slug: "palace-deluxe",
    name: "Palace Deluxe",
    tagline: "Balconies over the front lawn",
    description:
      "Spacious deluxe rooms with the palace's signature oxblood balconies, arched windows and a sit-out overlooking the 44,000 sq.ft front lawn. Colonial architecture, contemporary comfort.",
    priceInr: 12000,
    maxGuests: 3,
    sizeSqft: 520,
    totalUnits: 8,
    amenities: JSON.stringify(["King bed", "Private balcony", "Lawn view", "Minibar", "Marble bath", "Work desk", "24/7 room service"]),
    imageUrl: "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_20_7.jpg",
    images: ["https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_20_7.jpg", "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_22_5-1.jpg", "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_23_4-1.jpg"],
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "royal-suite",
    name: "Royal Suite",
    tagline: "A living room from another era",
    description:
      "A grand suite with separate living quarters, period furniture, hand-picked artefacts and sweeping views of the estate. Butler service and private dining on request.",
    priceInr: 18500,
    maxGuests: 4,
    sizeSqft: 850,
    totalUnits: 4,
    amenities: JSON.stringify(["Separate living room", "Butler service", "Club lounge access", "Soaking tub", "Estate view", "Private dining", "Walk-in wardrobe"]),
    imageUrl: "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_25_2-1.jpg",
    images: ["https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_25_2-1.jpg", "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_26_3-1.jpg", "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_27_6-2.jpg"],
    featured: true,
    sortOrder: 3,
  },
  {
    slug: "maharaja-suite",
    name: "Maharaja Suite",
    tagline: "The palace's crown jewel",
    description:
      "The signature suite atop the palace tower — turret views across Bengaluru's greenest acres, a private terrace, heirloom interiors and the full weight of Jaya Mahal's royal past.",
    priceInr: 28000,
    maxGuests: 4,
    sizeSqft: 1400,
    totalUnits: 2,
    amenities: JSON.stringify(["Tower terrace", "Butler service", "Private dining", "Heritage interiors", "Airport transfers", "Club lounge access", "Jacuzzi"]),
    imageUrl: "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_29_1-3.jpg",
    images: ["https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_29_1-3.jpg", "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_30_3-2.jpg", "https://jayamahalpalace.com/wp-content/uploads/2026/05/imgi_32_2.jpg"],
    featured: true,
    sortOrder: 4,
  },
];

async function main() {
  for (const r of rooms) {
    await prisma.room.upsert({ where: { slug: r.slug }, update: r, create: r });
  }
  const email = process.env.ADMIN_EMAIL || "admin@jayamahalpalace.com";
  const password = process.env.ADMIN_PASSWORD || "JayaMahal@2026";
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, name: process.env.ADMIN_NAME || "Palace Manager", passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log("Seeded rooms + admin:", email);
}

main().finally(() => prisma.$disconnect());
