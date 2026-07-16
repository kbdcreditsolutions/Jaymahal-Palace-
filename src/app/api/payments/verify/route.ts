import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { demoPaymentsEnabled, razorpayConfigured, verifyPaymentSignature } from "@/lib/razorpay";
import { confirmPaidBooking } from "@/lib/availability";

export const dynamic = "force-dynamic";

/**
 * Called by the Razorpay Checkout success handler. In demo mode (no gateway keys
 * AND DEMO_PAYMENTS=true) it confirms the booking directly so the flow stays
 * testable end-to-end without charging.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });
  if (!booking || !booking.payment)
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "CONFIRMED")
    return NextResponse.json({ ok: true, bookingRef: booking.bookingRef });

  if (razorpayConfigured()) {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    if (booking.payment.razorpayOrderId !== razorpay_order_id)
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });

    const result = await confirmPaidBooking(booking.id, razorpay_payment_id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json({ ok: true, bookingRef: booking.bookingRef, oversold: result.oversold });
  }

  if (!demoPaymentsEnabled())
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
  if (booking.payment.method !== "DEMO")
    return NextResponse.json({ error: "Gateway not configured" }, { status: 400 });

  const result = await confirmPaidBooking(booking.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
  return NextResponse.json({ ok: true, bookingRef: booking.bookingRef, demo: true, oversold: result.oversold });
}
