import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);

  const [arrivalsToday, inHouse, pendingPayments, confirmedRevenue, totalRooms, recentBookings] =
    await Promise.all([
      prisma.booking.count({
        where: { checkIn: { gte: todayStart, lt: todayEnd }, status: { in: ["CONFIRMED", "CHECKED_IN"] } },
      }),
      prisma.booking.count({ where: { status: "CHECKED_IN" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.aggregate({
        _sum: { amountInr: true },
        where: { status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] } },
      }),
      prisma.room.aggregate({ _sum: { totalUnits: true }, where: { active: true } }),
      prisma.booking.findMany({
        include: { room: true, payment: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const occupiedTonight = await prisma.booking.aggregate({
    _sum: { units: true },
    where: {
      status: { in: ["CONFIRMED", "CHECKED_IN"] },
      checkIn: { lt: todayEnd },
      checkOut: { gt: todayStart },
    },
  });

  return NextResponse.json({
    arrivalsToday,
    inHouse,
    pendingPayments,
    revenueInr: confirmedRevenue._sum.amountInr ?? 0,
    occupiedTonight: occupiedTonight._sum.units ?? 0,
    totalUnits: totalRooms._sum.totalUnits ?? 0,
    recentBookings,
  });
}
