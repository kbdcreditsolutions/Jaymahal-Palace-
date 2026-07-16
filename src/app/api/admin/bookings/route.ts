import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { inventoryWhere, makeBookingRef, parseStay } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    include: { room: true, payment: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ bookings });
}

/** Manual booking created by staff (walk-in / phone). Payment collected via link or at desk. */
export async function POST(req: NextRequest) {
  const b = await req.json();
  const stay = parseStay(b.checkIn, b.checkOut);
  if (!stay) return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  if (!b.roomId || !b.guestName || !b.phone)
    return NextResponse.json({ error: "roomId, guestName and phone are required" }, { status: 400 });

  const room = await prisma.room.findUnique({ where: { id: b.roomId } });
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const guests = Number(b.guests ?? 2);
  const amountInr = b.amountInr ? Number(b.amountInr) : room.priceInr * stay.nights;
  if (!Number.isFinite(guests) || guests < 1 || guests > 20)
    return NextResponse.json({ error: "Invalid guest count" }, { status: 400 });
  if (!Number.isFinite(amountInr) || amountInr < 0)
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const booked = await tx.booking.aggregate({
        _sum: { units: true },
        where: inventoryWhere(room.id, stay.checkIn, stay.checkOut),
      });
      if (room.totalUnits - (booked._sum.units ?? 0) <= 0) throw new Error("SOLD_OUT");

      return tx.booking.create({
        data: {
          bookingRef: makeBookingRef(),
          roomId: room.id,
          guestName: String(b.guestName).trim(),
          email: String(b.email ?? "").trim().toLowerCase(),
          phone: String(b.phone).trim(),
          checkIn: stay.checkIn,
          checkOut: stay.checkOut,
          guests,
          amountInr,
          status: b.confirmed ? "CONFIRMED" : "PENDING",
          source: "ADMIN",
          notes: String(b.notes ?? ""),
        },
        include: { room: true },
      });
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "SOLD_OUT")
      return NextResponse.json({ error: "Sold out for these dates" }, { status: 409 });
    throw e;
  }
}
