import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rooms = await prisma.room.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ rooms });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.name || !b.slug || !b.priceInr)
    return NextResponse.json({ error: "name, slug and priceInr are required" }, { status: 400 });

  const exists = await prisma.room.findUnique({ where: { slug: b.slug } });
  if (exists) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const room = await prisma.room.create({
    data: {
      slug: String(b.slug),
      name: String(b.name),
      tagline: String(b.tagline ?? ""),
      description: String(b.description ?? ""),
      priceInr: Number(b.priceInr),
      maxGuests: Number(b.maxGuests ?? 2),
      sizeSqft: Number(b.sizeSqft ?? 400),
      totalUnits: Number(b.totalUnits ?? 1),
      amenities: JSON.stringify(b.amenities ?? []),
      imageUrl: String(b.imageUrl ?? "/media/rooms/heritage-room.svg"),
      featured: !!b.featured,
      active: b.active !== false,
      sortOrder: Number(b.sortOrder ?? 99),
    },
  });
  return NextResponse.json({ room }, { status: 201 });
}
