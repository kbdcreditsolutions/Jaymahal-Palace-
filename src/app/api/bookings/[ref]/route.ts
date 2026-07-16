import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { ref: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { bookingRef: params.ref },
    include: { room: true, payment: true },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    bookingRef: booking.bookingRef,
    guestName: booking.guestName,
    roomName: booking.room.name,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    amountInr: booking.amountInr,
    status: booking.status,
    paymentStatus: booking.payment?.status ?? "NONE",
  });
}
