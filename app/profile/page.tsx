"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppShell } from "../components/app-shell";

export default function ProfilePage() {
  const { user } = useUser();
  const dbUser = useQuery(
    api.users.getByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const updateWeightUnit = useMutation(api.users.updateWeightUnit);

  if (!user) return null;

  return (
    <AppShell>
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-[var(--foreground-muted)]">
          Manage your account settings
        </p>
      </section>

      <div className="space-y-6">
        <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <h2 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">
            Email
          </h2>
          <p className="text-lg">{user.primaryEmailAddress?.emailAddress}</p>
        </div>

        <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <h2 className="text-sm font-medium text-[var(--foreground-muted)] mb-4">
            Weight Unit
          </h2>
          <div className="flex gap-2">
            {["kg", "lbs"].map((unit) => (
              <button
                key={unit}
                onClick={() => {
                  if (user?.id) {
                    updateWeightUnit({
                      clerkId: user.id,
                      weightUnit: unit as "kg" | "lbs",
                    });
                  }
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  dbUser?.weightUnit === unit
                    ? "bg-[var(--foreground)] text-[var(--background)] border-transparent"
                    : "bg-transparent border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--foreground-muted)]"
                }`}
              >
                {unit.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)]">
          <SignOutButton>
            <button className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    </AppShell>
  );
}
