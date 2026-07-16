import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { inventoryWhere, makeBookingRef, parseStay } from "@/lib/availability";
import { demoPaymentsEnabled, getRazorpay, razorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { roomSlug, guestName, email, phone, guests } = body as Record<string, string>;
  const stay = parseStay(body.checkIn as string, body.checkOut as string);

  if (!stay) return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  if (!roomSlug || typeof roomSlug !== "string")
    return NextResponse.json({ error: "Room is required" }, { status: 400 });
  if (!guestName?.trim() || guestName.trim().length < 2)
    return NextResponse.json({ error: "Guest name is required" }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  if (!phone || !/^[+\d][\d\s-]{7,15}$/.test(phone))
    return NextResponse.json({ error: "A valid phone number is required" }, { status: 400 });

  if (!razorpayConfigured() && !demoPaymentsEnabled())
    return NextResponse.json(
      { error: "Online payments are not configured yet. Please call the palace to book." },
      { status: 503 }
    );

  const guestCount = Number(guests) || 2;

  const room = await prisma.room.findUnique({ where: { slug: roomSlug } });
  if (!room || !room.active)
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  if (guestCount < 1 || guestCount > room.maxGuests)
    return NextResponse.json(
      { error: `This room hosts up to ${room.maxGuests} guests` },
      { status: 400 }
    );

  const amountInr = room.priceInr * stay.nights;

  // Availability check + booking creation in one transaction to limit oversell races.
  let booking;
  try {
    booking = await prisma.$transaction(async (tx) => {
      const booked = await tx.booking.aggregate({
        _sum: { units: true },
        where: inventoryWhere(room.id, stay.checkIn, stay.checkOut),
      });
      const available = room.totalUnits - (booked._sum.units ?? 0);
      if (available <= 0) throw new Error("SOLD_OUT");

      return tx.booking.create({
        data: {
          bookingRef: makeBookingRef(),
          roomId: room.id,
          guestName: guestName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          checkIn: stay.checkIn,
          checkOut: stay.checkOut,
          guests: guestCount,
          amountInr,
          status: "PENDING",
          source: "WEBSITE",
        },
      });
    });
  } catch (e) {
    if (e instanceof Error && e.message === "SOLD_OUT")
      return NextResponse.json({ error: "Sold out for these dates" }, { status: 409 });
    throw e;
  }

  if (razorpayConfigured()) {
    const rzp = getRazorpay()!;
    const order = await rzp.orders.create({
      amount: amountInr * 100,
      currency: "INR",
      receipt: booking.bookingRef,
      notes: { bookingRef: booking.bookingRef, room: room.name },
    });
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: order.id,
        amountInr,
        status: "CREATED",
        method: "CHECKOUT",
      },
    });
    return NextResponse.json({
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      amountInr,
      nights: stay.nights,
      order: {
        id: order.id,
        amount: amountInr * 100,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      },
      demo: false,
    });
  }

  // Demo mode: no gateway keys configured.
  await prisma.payment.create({
    data: { bookingId: booking.id, amountInr, status: "CREATED", method: "DEMO" },
  });
  return NextResponse.json({
    bookingId: booking.id,
    bookingRef: booking.bookingRef,
    amountInr,
    nights: stay.nights,
    demo: true,
  });
}
