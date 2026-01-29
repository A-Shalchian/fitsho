"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AppShell } from "../../components/app-shell";
import { useWorkout } from "../use-workout";

export default function PickExercisePage() {
  const { user } = useUser();
  const router = useRouter();
  const { getWorkout, addExercise } = useWorkout();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  const muscleGroups = useQuery(api.exercises.getMuscleGroups);
  const exercises = useQuery(
    api.exercises.list,
    selectedMuscle ? { muscleGroup: selectedMuscle } : {}
  );
  const saveWorkout = useMutation(api.workouts.saveWorkout);

  const workout = getWorkout();

  useEffect(() => {
    if (!workout) {
      router.push("/workout");
    }
  }, [workout, router]);

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];
    if (!searchQuery) return exercises;
    const query = searchQuery.toLowerCase();
    return exercises.filter((e) => e.name.toLowerCase().includes(query));
  }, [exercises, searchQuery]);

  if (!user || !workout) return null;

  const handleSelectExercise = (exercise: {
    _id: Id<"exercises">;
    name: string;
    muscleGroup: string;
  }) => {
    addExercise({
      exerciseId: exercise._id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
    });
    router.push("/workout/log");
  };

  const handleFinish = async () => {
    const currentWorkout = getWorkout();
    if (!currentWorkout || currentWorkout.exercises.length === 0) return;

    const exercisesWithSets = currentWorkout.exercises.filter((e) => e.sets.length > 0);
    if (exercisesWithSets.length === 0) {
      router.push("/workout");
      return;
    }

    await saveWorkout({
      userId: user.id,
      startedAt: currentWorkout.startedAt,
      exercises: exercisesWithSets.map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets,
      })),
    });

    router.push("/workout/done");
  };

  const handleMuscleSelect = (muscle: string | null) => {
    setSelectedMuscle(muscle);
    setSearchQuery("");
  };

  const exerciseCount = workout.exercises.length;

  return (
    <AppShell>
      {/* Header */}
      <div className="sticky top-0 z-10 -mx-4 px-4 pt-2 pb-4 bg-[var(--background)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/workout")}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground-muted)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold">Add Exercise</h1>
              {exerciseCount > 0 && (
                <p className="text-xs text-[var(--foreground-muted)]">
                  {exerciseCount} in workout
                </p>
              )}
            </div>
          </div>
          {exerciseCount > 0 && (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              Done
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Muscle Pills */}
        <div
          ref={pillsRef}
          className="-mx-4 px-4 overflow-x-auto scrollbar-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-2 pb-2">
            <button
              type="button"
              onClick={() => handleMuscleSelect(null)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                selectedMuscle === null
                  ? "bg-white text-black"
                  : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
              }`}
            >
              All
            </button>
            {muscleGroups?.map((muscle) => (
              <button
                type="button"
                key={muscle}
                onClick={() => handleMuscleSelect(muscle)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full capitalize transition-all ${
                  selectedMuscle === muscle
                    ? "bg-white text-black"
                    : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="pt-2 pb-6">
        {!exercises ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--surface)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[var(--foreground-muted)]">No exercises found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise._id}
                exercise={exercise}
                onClick={() => handleSelectExercise(exercise)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ExerciseCard({
  exercise,
  onClick,
}: {
  exercise: {
    _id: Id<"exercises">;
    name: string;
    muscleGroup: string;
    equipment: string;
    gifUrl?: string;
  };
  onClick: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all active:scale-[0.98]"
    >
      {/* Image */}
      <div className="aspect-square bg-[var(--background)] relative overflow-hidden">
        {exercise.gifUrl && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
              </div>
            )}
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[var(--border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Muscle badge */}
        <span className="absolute bottom-2 left-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent)] text-white rounded-md">
          {exercise.muscleGroup}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1 group-hover:text-[var(--accent)] transition-colors">
          {exercise.name}
        </h3>
        <p className="text-xs text-[var(--foreground-muted)] capitalize truncate">
          {exercise.equipment}
        </p>
      </div>
    </button>
  );
}
