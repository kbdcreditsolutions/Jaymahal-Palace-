import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "CHECKED_IN", "CHECKED_OUT"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const b = await req.json();
  const data: Record<string, unknown> = {};

  if (b.status !== undefined) {
    if (!VALID_STATUSES.includes(b.status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    data.status = b.status;
  }
  if (b.notes !== undefined) data.notes = String(b.notes);
  if (b.guestName !== undefined) data.guestName = String(b.guestName).trim();
  if (b.phone !== undefined) data.phone = String(b.phone).trim();
  if (b.email !== undefined) data.email = String(b.email).trim().toLowerCase();
  if (b.guests !== undefined) {
    const g = Number(b.guests);
    if (!Number.isFinite(g) || g < 1 || g > 20)
      return NextResponse.json({ error: "Invalid guest count" }, { status: 400 });
    data.guests = g;
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data,
      include: { room: true, payment: true },
    });
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
}
