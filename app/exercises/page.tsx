"use client";

import { useState, useMemo, type JSX } from "react";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AppShell } from "../components/app-shell";

interface Exercise {
  _id: Id<"exercises">;
  name: string;
  muscleGroup: string;
  equipment: string;
  gifUrl?: string;
  instructions?: string[];
  secondaryMuscles?: string[];
}

type SortOption = "name" | "muscleGroup" | "equipment";

const selectClassName =
  "px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--foreground-muted)] transition-colors cursor-pointer min-w-[140px]";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Spinner(): JSX.Element {
  return (
    <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--foreground-muted)] rounded-full animate-spin" />
  );
}

export default function ExercisesPage(): JSX.Element | null {
  const { user } = useUser();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [muscleFilter, setMuscleFilter] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");

  const muscleGroups = useQuery(api.exercises.getMuscleGroups);
  const equipmentList = useQuery(api.exercises.getEquipmentList);

  const { results, status, loadMore } = usePaginatedQuery(
    api.exercises.listPaginated,
    {
      muscleGroup: muscleFilter || undefined,
      equipment: equipmentFilter || undefined,
    },
    { initialNumItems: 20 }
  );

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => a[sortBy].localeCompare(b[sortBy])) as Exercise[];
  }, [results, sortBy]);

  if (!user) return null;

  const hasFilters = muscleFilter || equipmentFilter;

  function clearFilters(): void {
    setMuscleFilter("");
    setEquipmentFilter("");
  }

  return (
    <AppShell>
      <section className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
            <p className="mt-1 text-[var(--foreground-muted)]">
              {results.length} exercises {hasFilters && "(filtered)"}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--foreground-muted)]">Muscle</label>
            <select
              value={muscleFilter}
              onChange={(e) => setMuscleFilter(e.target.value)}
              className={selectClassName}
            >
              <option value="">All Muscles</option>
              {muscleGroups?.map((group) => (
                <option key={group} value={group}>
                  {capitalize(group)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--foreground-muted)]">Equipment</label>
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className={selectClassName}
            >
              <option value="">All Equipment</option>
              {equipmentList?.map((eq) => (
                <option key={eq} value={eq}>
                  {capitalize(eq)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--foreground-muted)]">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={selectClassName}
            >
              <option value="name">Name (A-Z)</option>
              <option value="muscleGroup">Muscle Group</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {sortedResults.length === 0 && status !== "LoadingFirstPage" ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 mb-4 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-[var(--foreground-muted)] mb-4">No exercises found</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:border-[var(--foreground-muted)] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {sortedResults.map((exercise: Exercise) => (
              <ExerciseCard
                key={exercise._id}
                exercise={exercise}
                onClick={() => setSelectedExercise(exercise)}
              />
            ))}
          </div>

          {status === "CanLoadMore" && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => loadMore(20)}
                className="px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-sm font-medium rounded-lg hover:border-[var(--foreground-muted)] transition-colors"
              >
                Load More
              </button>
            </div>
          )}

          {status === "LoadingMore" && (
            <div className="mt-8 flex justify-center">
              <div className="text-[var(--foreground-muted)]">Loading...</div>
            </div>
          )}
        </>
      )}

      {status === "LoadingFirstPage" && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </AppShell>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

function ExerciseCard({ exercise, onClick }: ExerciseCardProps): JSX.Element {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="text-left p-4 lg:p-5 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--foreground-muted)] transition-colors"
    >
      <div className="aspect-square bg-[var(--background)] rounded-lg mb-4 overflow-hidden relative">
        {exercise.gifUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </div>
            )}
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-opacity ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[var(--border)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-base lg:text-lg leading-tight mb-3 line-clamp-2">
        {exercise.name}
      </h3>

      <div className="flex flex-wrap gap-2">
        <span className="px-2.5 py-1 text-xs lg:text-sm bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 rounded-full">
          {exercise.muscleGroup}
        </span>
        <span className="px-2.5 py-1 text-xs lg:text-sm bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--foreground-muted)]">
          {exercise.equipment}
        </span>
      </div>
    </button>
  );
}

interface ExerciseModalProps {
  exercise: Exercise;
  onClose: () => void;
}

function ExerciseModal({ exercise, onClose }: ExerciseModalProps): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lg:flex">
          <div className="lg:w-1/2 aspect-square bg-[var(--background)] relative flex-shrink-0">
            {exercise.gifUrl ? (
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[var(--foreground-muted)]">No image available</span>
              </div>
            )}
          </div>

          <div className="p-6 lg:p-8 lg:w-1/2">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">{exercise.name}</h2>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-full">
                {exercise.muscleGroup}
              </span>
              <span className="px-3 py-1.5 text-sm bg-[var(--background)] border border-[var(--border)] rounded-full">
                {exercise.equipment}
              </span>
            </div>

            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">
                  Secondary Muscles
                </h3>
                <p className="text-base">{exercise.secondaryMuscles.join(", ")}</p>
              </div>
            )}

            {exercise.instructions && exercise.instructions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-3">
                  Instructions
                </h3>
                <ol className="text-base space-y-3 text-[var(--foreground-muted)]">
                  {exercise.instructions.map((instruction, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[var(--accent)] font-semibold flex-shrink-0">{i + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 px-4 py-3 bg-[var(--background)] border border-[var(--border)] text-sm font-medium rounded-lg hover:border-[var(--foreground-muted)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
