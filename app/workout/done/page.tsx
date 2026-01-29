"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AppShell } from "../../components/app-shell";
import { useWorkout } from "../use-workout";

export default function WorkoutDonePage() {
  const { user } = useUser();
  const router = useRouter();
  const { clearWorkout } = useWorkout();

  if (!user) return null;

  const handleDone = () => {
    clearWorkout();
    router.push("/");
  };

  const handleNewWorkout = () => {
    clearWorkout();
    router.push("/workout");
  };

  return (
    <AppShell>
      <div className="min-h-[75vh] flex flex-col items-center justify-center -mt-8">
        <div className="w-full max-w-xs text-center">
          {/* Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-3xl blur-xl" />
            <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-2xl font-bold mb-2">Workout Complete!</h1>
          <p className="text-[var(--foreground-muted)] text-sm mb-8">
            Great work! Your session has been saved.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleDone}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg shadow-white/10"
            >
              Done
            </button>
            <button
              onClick={handleNewWorkout}
              className="w-full py-4 bg-[var(--surface)] border border-[var(--border)] font-semibold rounded-2xl hover:border-[var(--foreground-muted)] transition-all active:scale-[0.98]"
            >
              Start Another
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
