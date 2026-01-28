"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import Link from "next/link";
import { Landing } from "./components/landing";
import { AppShell } from "./components/app-shell";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.users.create);

  useEffect(() => {
    if (user) {
      createUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? user.firstName ?? "User",
      });
    }
  }, [user, createUser]);

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return <Landing />;
  }

  const firstName = user.firstName || user.fullName?.split(" ")[0] || "there";

  return (
    <AppShell>
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Hey, {firstName}</h1>
        <p className="mt-2 text-[var(--foreground-muted)]">Ready to lift?</p>
      </section>

      <section className="mb-12">
        <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">This Week</h2>
            <span className="text-sm text-[var(--foreground-muted)]">
              Jan 2026
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center">
                <span className="text-xs text-[var(--foreground-muted)]">
                  {day}
                </span>
                <div className="mt-2 aspect-square rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
                  <span className="text-sm text-[var(--foreground-muted)]">
                    -
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <Link
          href="/workout"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Start Workout
        </Link>
      </section>
    </AppShell>
  );
}
