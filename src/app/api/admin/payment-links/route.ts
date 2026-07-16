import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { demoPaymentsEnabled, getRazorpay, razorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

/** Generate a Razorpay payment link for a booking so staff can collect payment remotely. */
export async function POST(req: NextRequest) {
  const { bookingId } = await req.json();
  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true, payment: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.payment?.status === "PAID")
    return NextResponse.json({ error: "Booking is already paid" }, { status: 409 });
  if (booking.payment?.linkUrl)
    return NextResponse.json({ linkUrl: booking.payment.linkUrl, reused: true });

  if (!razorpayConfigured()) {
    if (!demoPaymentsEnabled())
      return NextResponse.json(
        { error: "Razorpay is not configured — add gateway keys to generate payment links" },
        { status: 503 }
      );
    // Demo mode — record a placeholder link so the workflow is exercisable without keys.
    const linkUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/booking/${booking.bookingRef}?demo-pay=1`;
    const payment = booking.payment
      ? await prisma.payment.update({
          where: { id: booking.payment.id },
          data: { linkUrl, method: "DEMO" },
        })
      : await prisma.payment.create({
          data: { bookingId: booking.id, amountInr: booking.amountInr, linkUrl, method: "DEMO" },
        });
    return NextResponse.json({ linkUrl: payment.linkUrl, demo: true });
  }

  const rzp = getRazorpay()!;
  const link = await rzp.paymentLink.create({
    amount: booking.amountInr * 100,
    currency: "INR",
    accept_partial: false,
    description: `Jaya Mahal Palace · ${booking.room.name} · ${booking.bookingRef}`,
    customer: {
      name: booking.guestName,
      email: booking.email || undefined,
      contact: booking.phone,
    },
    notify: { sms: true, email: !!booking.email },
    reminder_enable: true,
    notes: { bookingRef: booking.bookingRef },
    callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/booking/${booking.bookingRef}`,
    callback_method: "get",
  });

  if (booking.payment) {
    await prisma.payment.update({
      where: { id: booking.payment.id },
      data: { razorpayLinkId: link.id, linkUrl: link.short_url, method: "LINK" },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amountInr: booking.amountInr,
        razorpayLinkId: link.id,
        linkUrl: link.short_url,
        method: "LINK",
      },
    });
  }

  return NextResponse.json({ linkUrl: link.short_url });
}
