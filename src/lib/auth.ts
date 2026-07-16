import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters — refusing to run without it");
  }
  return new TextEncoder().encode(s);
}

export const ADMIN_COOKIE = "jm_admin";

export async function signAdminToken(payload: { sub: string; email: string; name: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(jwtSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    return payload as { sub: string; email: string; name: string };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
