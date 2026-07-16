import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json();
  const data: Record<string, unknown> = {};

  if (b.name !== undefined) data.name = String(b.name);
  if (b.tagline !== undefined) data.tagline = String(b.tagline);
  if (b.description !== undefined) data.description = String(b.description);
  if (b.priceInr !== undefined) data.priceInr = Number(b.priceInr);
  if (b.maxGuests !== undefined) data.maxGuests = Number(b.maxGuests);
  if (b.sizeSqft !== undefined) data.sizeSqft = Number(b.sizeSqft);
  if (b.totalUnits !== undefined) data.totalUnits = Number(b.totalUnits);
  if (b.amenities !== undefined) data.amenities = JSON.stringify(b.amenities);
  if (b.imageUrl !== undefined) data.imageUrl = String(b.imageUrl);
  if (b.featured !== undefined) data.featured = !!b.featured;
  if (b.active !== undefined) data.active = !!b.active;
  if (b.sortOrder !== undefined) data.sortOrder = Number(b.sortOrder);

  if (
    (data.priceInr !== undefined && (!Number.isFinite(data.priceInr) || (data.priceInr as number) <= 0)) ||
    (data.totalUnits !== undefined && (!Number.isFinite(data.totalUnits) || (data.totalUnits as number) < 0))
  )
    return NextResponse.json({ error: "Invalid numeric values" }, { status: 400 });

  try {
    const room = await prisma.room.update({ where: { id: params.id }, data });
    return NextResponse.json({ room });
  } catch {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const count = await prisma.booking.count({ where: { roomId: params.id } });
  if (count > 0)
    return NextResponse.json(
      { error: "Room has bookings — mark it inactive instead of deleting" },
      { status: 409 }
    );
  try {
    await prisma.room.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
}
