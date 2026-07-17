import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { inventoryWhere, parseStay } from "@/lib/availability";

export const dynamic = "force-dynamic";

function safeAmenities(raw: string) {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stay = parseStay(searchParams.get("checkIn"), searchParams.get("checkOut"));

  const rooms = await prisma.room.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const result = await Promise.all(
    rooms.map(async (room) => {
      let available: number | null = null;
      if (stay) {
        const booked = await prisma.booking.aggregate({
          _sum: { units: true },
          where: inventoryWhere(room.id, stay.checkIn, stay.checkOut),
        });
        available = Math.max(0, room.totalUnits - (booked._sum.units ?? 0));
      }
      return {
        id: room.id,
        slug: room.slug,
        name: room.name,
        tagline: room.tagline,
        description: room.description,
        priceInr: room.priceInr,
        maxGuests: room.maxGuests,
        sizeSqft: room.sizeSqft,
        totalUnits: room.totalUnits,
        amenities: safeAmenities(room.amenities),
        imageUrl: room.imageUrl,
        images: room.images,
        featured: room.featured,
        available,
      };
    })
  );

  return NextResponse.json({ rooms: result, nights: stay?.nights ?? null });
}
