"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppShell } from "../components/app-shell";

export default function WorkoutPage() {
  const { user } = useUser();
  const activeWorkout = useQuery(
    api.workouts.getActive,
    user?.id ? { userId: user.id } : "skip"
  );
  const startWorkout = useMutation(api.workouts.start);
  const completeWorkout = useMutation(api.workouts.complete);
  const addExercise = useMutation(api.workoutExercises.add);
  const addSet = useMutation(api.sets.add);

  if (!user) return null;

  return (
    <AppShell>
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Workout</h1>
        <p className="mt-2 text-[var(--foreground-muted)]">
          {activeWorkout ? "Session in progress" : "Start a new session"}
        </p>
      </section>

      {activeWorkout ? (
        <div className="space-y-6">
          <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Current Session</h2>
              <span className="text-sm text-[var(--foreground-muted)]">
                {new Date(activeWorkout._creationTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-[var(--foreground-muted)] mb-6">
              Add exercises and log sets here
            </p>
            <button
              onClick={() => completeWorkout({ workoutId: activeWorkout._id })}
              className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:border-[var(--foreground-muted)] transition-colors"
            >
              Finish Workout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--foreground-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-[var(--foreground-muted)]">No active workout</p>
          </div>
          <button
            onClick={() => startWorkout({ userId: user.id })}
            className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Workout
          </button>
        </div>
      )}
    </AppShell>
  );
}
