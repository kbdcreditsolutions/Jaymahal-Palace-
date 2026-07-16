# Jaya Mahal Palace — Booking Platform

Immersive heritage-hotel website + booking engine + admin portal for jayamahalpalace.com.

## Stack

Next.js 14 (App Router) · Tailwind · framer-motion · Prisma + SQLite · Razorpay · JWT admin auth (jose + bcrypt).

## Run

```bash
npm install
npx prisma migrate dev   # creates dev.db
npx prisma db seed       # rooms + admin user (from .env)
npm run dev              # http://localhost:3100
```

Admin portal: `/admin` — credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` at seed time.

## Payments

- **Demo mode** (`DEMO_PAYMENTS="true"`, no Razorpay keys): checkout confirms bookings without charging, payment links are placeholders. For local testing only.
- **Live**: set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_WEBHOOK_SECRET`, and set `DEMO_PAYMENTS="false"`. Point a Razorpay webhook (events: `payment.captured`, `payment_link.paid`) at `/api/payments/webhook`.

## Features

- Scroll-driven cinematic video hero (native scroll, reduced-motion safe)
- Live availability: 30-min pending holds, transaction-guarded booking creation, oversell re-check on payment confirmation
- Guest checkout with Razorpay (signature-verified) → instant confirmation page with booking ref
- Admin: dashboard (occupancy/revenue/arrivals), bookings (status lifecycle, manual/walk-in creation, Razorpay payment-link generation with copy), rooms (price/inventory/visibility editing — changes hit the live site immediately)

## Production notes

- Swap SQLite → Postgres before real traffic (`datasource` in `prisma/schema.prisma`, `DATABASE_URL`).
- `JWT_SECRET` is mandatory (32+ chars); the app rejects all admin traffic without it.
- Replace `/public/media/rooms/*.svg` placeholders with real room photography via the admin Image URL field.
