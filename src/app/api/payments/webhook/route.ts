import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { confirmPaidBooking } from "@/lib/availability";

export const dynamic = "force-dynamic";

/** Razorpay webhook: payment.captured (checkout) + payment_link.paid (admin links). */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature))
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(raw);

  if (event.event === "payment.captured") {
    const orderId = event.payload?.payment?.entity?.order_id;
    const paymentId = event.payload?.payment?.entity?.id;
    if (orderId) {
      const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
      if (payment && payment.status !== "PAID") {
        await confirmPaidBooking(payment.bookingId, paymentId);
      }
    }
  }

  if (event.event === "payment_link.paid") {
    const linkId = event.payload?.payment_link?.entity?.id;
    const paymentId = event.payload?.payment?.entity?.id;
    if (linkId) {
      const payment = await prisma.payment.findFirst({ where: { razorpayLinkId: linkId } });
      if (payment && payment.status !== "PAID") {
        await confirmPaidBooking(payment.bookingId, paymentId);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
