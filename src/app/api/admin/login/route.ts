import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { ADMIN_COOKIE, signAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// In-memory brute-force throttle: 5 attempts per identity per 15 minutes.
// Sufficient for a single-instance deploy; move to Redis if scaled out.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function throttled(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { email, password } = body;
  if (!email || !password)
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = `${ip}:${email.toLowerCase().trim()}`;
  if (throttled(key))
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  attempts.delete(key);

  const token = await signAdminToken({ sub: admin.id, email: admin.email, name: admin.name });
  const res = NextResponse.json({ ok: true, name: admin.name });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return res;
}
