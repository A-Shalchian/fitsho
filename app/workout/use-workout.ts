"use client";

import { useCallback } from "react";
import { Id } from "@/convex/_generated/dataModel";

export interface LocalSet {
  weight: number;
  reps: number;
  rpe?: number;
  isWarmup: boolean;
}

export interface LocalExercise {
  exerciseId: Id<"exercises">;
  name: string;
  muscleGroup: string;
  sets: LocalSet[];
}

export interface WorkoutState {
  startedAt: number;
  exercises: LocalExercise[];
  currentExerciseIndex: number;
}

const STORAGE_KEY = "fitsho-active-workout";

export function useWorkout() {
  const getWorkout = useCallback((): WorkoutState | null => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, []);

  const setWorkout = useCallback((workout: WorkoutState | null) => {
    if (typeof window === "undefined") return;
    if (workout) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(workout));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const startWorkout = useCallback(() => {
    const workout: WorkoutState = {
      startedAt: Date.now(),
      exercises: [],
      currentExerciseIndex: 0,
    };
    setWorkout(workout);
    return workout;
  }, [setWorkout]);

  const addExercise = useCallback(
    (exercise: { exerciseId: Id<"exercises">; name: string; muscleGroup: string }) => {
      const workout = getWorkout();
      if (!workout) return;

      const newExercise: LocalExercise = {
        ...exercise,
        sets: [],
      };

      const updated: WorkoutState = {
        ...workout,
        exercises: [...workout.exercises, newExercise],
        currentExerciseIndex: workout.exercises.length,
      };
      setWorkout(updated);
    },
    [getWorkout, setWorkout]
  );

  const addSet = useCallback(
    (set: LocalSet) => {
      const workout = getWorkout();
      if (!workout) return;

      const exercises = [...workout.exercises];
      const current = exercises[workout.currentExerciseIndex];
      if (!current) return;

      exercises[workout.currentExerciseIndex] = {
        ...current,
        sets: [...current.sets, set],
      };

      setWorkout({ ...workout, exercises });
    },
    [getWorkout, setWorkout]
  );

  const removeSet = useCallback(
    (setIndex: number) => {
      const workout = getWorkout();
      if (!workout) return;

      const exercises = [...workout.exercises];
      const current = exercises[workout.currentExerciseIndex];
      if (!current) return;

      exercises[workout.currentExerciseIndex] = {
        ...current,
        sets: current.sets.filter((_, i) => i !== setIndex),
      };

      setWorkout({ ...workout, exercises });
    },
    [getWorkout, setWorkout]
  );

  const clearWorkout = useCallback(() => {
    setWorkout(null);
  }, [setWorkout]);

  return {
    getWorkout,
    setWorkout,
    startWorkout,
    addExercise,
    addSet,
    removeSet,
    clearWorkout,
  };
}
