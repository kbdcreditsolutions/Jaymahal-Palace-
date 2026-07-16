"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push(params.get("next") || "/admin");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Login failed");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass w-full max-w-sm rounded-xl p-8">
      <div className="mb-8 text-center">
        <KeyRound className="mx-auto text-[var(--jm-gold)]" size={28} />
        <h1 className="font-display mt-4 text-2xl font-semibold">Palace Admin</h1>
        <p className="mt-1 text-xs text-[var(--jm-muted)]">Staff access only</p>
      </div>
      <label htmlFor="email" className="label-jm">Email</label>
      <input id="email" type="email" className="input-jm mb-4" value={email}
        onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
      <label htmlFor="password" className="label-jm">Password</label>
      <input id="password" type="password" className="input-jm" value={password}
        onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
      <button type="submit" className="btn-gold mt-6 w-full" disabled={busy}>
        {busy && <Loader2 size={15} className="animate-spin" />} Sign in
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
