import { prisma } from "./db";

const PENDING_HOLD_MINUTES = 30;

/** Bookings that consume inventory for an overlapping date range. */
export function inventoryWhere(roomId: string, checkIn: Date, checkOut: Date) {
  const holdCutoff = new Date(Date.now() - PENDING_HOLD_MINUTES * 60 * 1000);
  return {
    roomId,
    checkIn: { lt: checkOut },
    checkOut: { gt: checkIn },
    OR: [
      { status: { in: ["CONFIRMED", "CHECKED_IN"] } },
      { status: "PENDING", createdAt: { gt: holdCutoff } },
    ],
  };
}

export async function availableUnits(roomId: string, checkIn: Date, checkOut: Date) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room || !room.active) return 0;
  const booked = await prisma.booking.aggregate({
    _sum: { units: true },
    where: inventoryWhere(roomId, checkIn, checkOut),
  });
  return Math.max(0, room.totalUnits - (booked._sum.units ?? 0));
}

export function nightsBetween(checkIn: Date, checkOut: Date) {
  return Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
}

export function parseStay(checkInStr?: string | null, checkOutStr?: string | null) {
  if (!checkInStr || !checkOutStr) return null;
  const checkIn = new Date(`${checkInStr}T00:00:00.000Z`);
  const checkOut = new Date(`${checkOutStr}T00:00:00.000Z`);
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return null;
  if (checkOut <= checkIn) return null;
  if (nightsBetween(checkIn, checkOut) > 30) return null;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (checkIn < today) return null;
  return { checkIn, checkOut, nights: nightsBetween(checkIn, checkOut) };
}

/**
 * Mark a booking paid + confirmed, re-checking inventory inside the transaction.
 * If the room oversold in the meantime (e.g. a >30min stale hold was displaced),
 * the payment is still recorded but the booking is flagged for staff follow-up.
 */
export async function confirmPaidBooking(bookingId: string, razorpayPaymentId?: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true, room: true },
    });
    if (!booking || !booking.payment) return { ok: false as const, error: "Booking not found" };
    if (booking.status === "CONFIRMED") return { ok: true as const, oversold: false };

    const others = await tx.booking.aggregate({
      _sum: { units: true },
      where: { ...inventoryWhere(booking.roomId, booking.checkIn, booking.checkOut), id: { not: booking.id } },
    });
    const oversold = (others._sum.units ?? 0) + booking.units > booking.room.totalUnits;

    await tx.payment.update({
      where: { id: booking.payment.id },
      data: { status: "PAID", ...(razorpayPaymentId ? { razorpayPaymentId } : {}) },
    });
    await tx.booking.update({
      where: { id: booking.id },
      data: oversold
        ? { notes: `${booking.notes} [OVERSOLD — payment received, relocate or refund]`.trim() }
        : { status: "CONFIRMED" },
    });
    return { ok: true as const, oversold };
  });
}

export function makeBookingRef() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `JM-${s}`;
}
