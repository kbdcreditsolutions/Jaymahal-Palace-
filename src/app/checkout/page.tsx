import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CheckoutClient from "./CheckoutClient";

export const metadata = { title: "Checkout · Jaya Mahal Palace" };

export default function CheckoutPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-32">
        <Suspense fallback={<p className="text-center text-sm text-[var(--jm-muted)]">Loading…</p>}>
          <CheckoutClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
