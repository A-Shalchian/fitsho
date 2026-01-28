import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    weightUnit: v.union(v.literal("kg"), v.literal("lbs")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  exercises: defineTable({
    name: v.string(),
    muscleGroup: v.string(),
    secondaryMuscles: v.optional(v.array(v.string())),
    equipment: v.string(),
    gifUrl: v.optional(v.string()),
    instructions: v.optional(v.array(v.string())),
    isCustom: v.boolean(),
    userId: v.optional(v.string()),
  })
    .index("by_muscle_group", ["muscleGroup"])
    .index("by_user", ["userId"]),

  workouts: defineTable({
    userId: v.string(),
    name: v.optional(v.string()),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "startedAt"]),

  workoutExercises: defineTable({
    workoutId: v.id("workouts"),
    exerciseId: v.id("exercises"),
    order: v.number(),
  }).index("by_workout", ["workoutId"]),

  sets: defineTable({
    workoutExerciseId: v.id("workoutExercises"),
    setNumber: v.number(),
    weight: v.number(),
    reps: v.number(),
    rpe: v.optional(v.number()),
    isWarmup: v.boolean(),
    completedAt: v.number(),
  }).index("by_workout_exercise", ["workoutExerciseId"]),

  supplements: defineTable({
    userId: v.string(),
    name: v.string(),
    order: v.number(),
  }).index("by_user", ["userId"]),

  supplementLogs: defineTable({
    userId: v.string(),
    supplementId: v.id("supplements"),
    date: v.string(),
    taken: v.boolean(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_supplement_date", ["supplementId", "date"]),
});
