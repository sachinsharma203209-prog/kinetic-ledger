"use client";

import { Landmark } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      {/* Atmospheric blurred circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container">
            <Landmark className="h-7 w-7 text-on-primary-container" />
          </div>
          <h1 className="text-headline-lg font-semibold">Kinetic Ledger</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Earn, grow, and manage your digital rewards
          </p>
        </div>

        {/* Auth card */}
        <div className="auth-card rounded-2xl p-8">{children}</div>
      </div>
    </div>
  );
}
