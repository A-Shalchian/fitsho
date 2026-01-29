"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppShell } from "../../components/app-shell";
import { useWorkout } from "../use-workout";

export default function LogExercisePage() {
  const { user } = useUser();
  const router = useRouter();
  const { getWorkout, setWorkout, addSet, removeSet, clearWorkout } = useWorkout();
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [isWarmup, setIsWarmup] = useState(false);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [, forceUpdate] = useState(0);
  const saveWorkoutMutation = useMutation(api.workouts.saveWorkout);

  const workout = getWorkout();

  useEffect(() => {
    if (!workout || workout.exercises.length === 0) {
      router.push("/workout");
    }
  }, [workout, router]);

  const refreshWorkout = () => {
    forceUpdate((n) => n + 1);
  };

  if (!user || !workout) return null;

  const currentExercise = workout.exercises[workout.currentExerciseIndex];
  if (!currentExercise) {
    router.push("/workout/pick");
    return null;
  }

  const handleAddSet = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);

    if (isNaN(w) || isNaN(r) || w < 0 || r < 1) return;

    addSet({
      weight: w,
      reps: r,
      isWarmup,
    });

    setWeight("");
    setReps("");
    setIsWarmup(false);
    refreshWorkout();
  };

  const handleRemoveSet = (index: number) => {
    removeSet(index);
    refreshWorkout();
  };

  const handleAddExercise = () => {
    router.push("/workout/pick");
  };

  const handleSwitchExercise = (index: number) => {
    const w = getWorkout();
    if (!w) return;
    setWorkout({ ...w, currentExerciseIndex: index });
    setShowExerciseList(false);
    forceUpdate((n) => n + 1);
  };

  const handleFinish = async () => {
    const currentWorkout = getWorkout();
    if (!currentWorkout) return;

    const exercisesWithSets = currentWorkout.exercises.filter((e) => e.sets.length > 0);
    if (exercisesWithSets.length === 0) {
      clearWorkout();
      router.push("/workout");
      return;
    }

    await saveWorkoutMutation({
      userId: user.id,
      startedAt: currentWorkout.startedAt,
      exercises: exercisesWithSets.map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets,
      })),
    });

    clearWorkout();
    router.push("/workout/done");
  };

  const workingSets = currentExercise.sets.filter((s) => !s.isWarmup);
  let workingSetCounter = 0;
  const totalExercises = workout.exercises.length;
  const currentNum = workout.currentExerciseIndex + 1;

  return (
    <AppShell>
      {/* Header */}
      <div className="sticky top-0 z-10 -mx-4 px-4 pt-2 pb-4 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddExercise}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground-muted)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setShowExerciseList(!showExerciseList)}
            className="flex-1 min-w-0 text-left"
          >
            <h1 className="text-lg font-bold truncate">{currentExercise.name}</h1>
            <p className="text-xs text-[var(--accent)]">
              <span className="capitalize">{currentExercise.muscleGroup}</span>
              <span className="text-[var(--foreground-muted)]"> · {currentNum}/{totalExercises} exercises</span>
            </p>
          </button>
          {totalExercises > 1 && (
            <button
              onClick={() => setShowExerciseList(!showExerciseList)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground-muted)] transition-colors"
            >
              <svg className={`w-5 h-5 transition-transform ${showExerciseList ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Exercise Switcher Dropdown */}
        {showExerciseList && (
          <div className="mt-3 p-2 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] px-2 py-1 mb-1">
              Your Exercises
            </div>
            {workout.exercises.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleSwitchExercise(idx)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                  idx === workout.currentExerciseIndex
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "hover:bg-[var(--background)]"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  idx === workout.currentExerciseIndex
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--background)] text-[var(--foreground-muted)]"
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{ex.name}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    {ex.sets.length} set{ex.sets.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="py-4 space-y-4">
        {/* Sets Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Sets
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">
              {workingSets.length} working
            </span>
          </div>

          {currentExercise.sets.length === 0 ? (
            <div className="py-8 text-center bg-[var(--surface)] rounded-2xl border border-dashed border-[var(--border)]">
              <p className="text-sm text-[var(--foreground-muted)]">No sets yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentExercise.sets.map((set, index) => {
                const isWorking = !set.isWarmup;
                if (isWorking) workingSetCounter++;
                const displayNum = isWorking ? workingSetCounter : null;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      set.isWarmup
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-[var(--surface)] border-[var(--border)]"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                        set.isWarmup
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-[var(--accent)]/20 text-[var(--accent)]"
                      }`}
                    >
                      {set.isWarmup ? "W" : displayNum}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold">{set.weight}</span>
                      <span className="text-[var(--foreground-muted)] text-sm"> lbs</span>
                      <span className="mx-2 text-[var(--border)]">&times;</span>
                      <span className="font-semibold">{set.reps}</span>
                      <span className="text-[var(--foreground-muted)] text-sm"> reps</span>
                    </div>
                    <button
                      onClick={() => handleRemoveSet(index)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-2">
                Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 pr-12 bg-[var(--background)] border border-[var(--border)] rounded-xl text-lg font-semibold focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--foreground-muted)]">
                  lbs
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-2">
                Reps
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-lg font-semibold focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 mb-4 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => setIsWarmup(!isWarmup)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                isWarmup
                  ? "bg-amber-500 border-amber-500"
                  : "border-[var(--border)] hover:border-[var(--foreground-muted)]"
              }`}
            >
              {isWarmup && (
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-sm">Warmup set</span>
          </label>

          <button
            onClick={handleAddSet}
            disabled={!weight || !reps}
            className="w-full py-3.5 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[var(--accent-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            Add Set
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 -mx-4 px-4 py-4 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAddExercise}
            className="py-3.5 bg-[var(--surface)] border border-[var(--border)] font-semibold rounded-xl hover:border-[var(--foreground-muted)] transition-all active:scale-[0.98]"
          >
            + Exercise
          </button>
          <button
            onClick={handleFinish}
            className="py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all active:scale-[0.98]"
          >
            Finish
          </button>
        </div>
      </div>
    </AppShell>
  );
}
