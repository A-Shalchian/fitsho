"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AppShell } from "../components/app-shell";
import { useWorkout } from "./use-workout";

export default function WorkoutPage() {
  const { user } = useUser();
  const router = useRouter();
  const { startWorkout } = useWorkout();

  if (!user) return null;

  const handleStart = () => {
    startWorkout();
    router.push("/workout/pick");
  };

  return (
    <AppShell>
      <div className="min-h-[75vh] flex flex-col items-center justify-center -mt-8">
        <div className="w-full max-w-xs text-center">
          {/* Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-[var(--accent)]/20 rounded-3xl blur-xl" />
            <div className="relative w-full h-full bg-gradient-to-br from-[var(--accent)] to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-[var(--accent)]/25">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-2xl font-bold mb-2">Ready to lift?</h1>
          <p className="text-[var(--foreground-muted)] text-sm mb-8">
            Start your workout and track your progress
          </p>

          {/* CTA */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg shadow-white/10"
          >
            Start Workout
          </button>
        </div>
      </div>
    </AppShell>
  );
}
