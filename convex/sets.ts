import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    workoutExerciseId: v.id("workoutExercises"),
    weight: v.number(),
    reps: v.number(),
    rpe: v.optional(v.number()),
    isWarmup: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existingSets = await ctx.db
      .query("sets")
      .withIndex("by_workout_exercise", (q) => q.eq("workoutExerciseId", args.workoutExerciseId))
      .collect();

    return await ctx.db.insert("sets", {
      workoutExerciseId: args.workoutExerciseId,
      setNumber: existingSets.length + 1,
      weight: args.weight,
      reps: args.reps,
      rpe: args.rpe,
      isWarmup: args.isWarmup ?? false,
      completedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    setId: v.id("sets"),
    weight: v.optional(v.number()),
    reps: v.optional(v.number()),
    rpe: v.optional(v.number()),
    isWarmup: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { setId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(setId, filtered);
  },
});

export const remove = mutation({
  args: { setId: v.id("sets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.setId);
  },
});

export const getLastPerformance = query({
  args: {
    userId: v.string(),
    exerciseId: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.neq(q.field("completedAt"), undefined))
      .order("desc")
      .take(20);

    for (const workout of workouts) {
      const workoutExercises = await ctx.db
        .query("workoutExercises")
        .withIndex("by_workout", (q) => q.eq("workoutId", workout._id))
        .filter((q) => q.eq(q.field("exerciseId"), args.exerciseId))
        .first();

      if (workoutExercises) {
        const sets = await ctx.db
          .query("sets")
          .withIndex("by_workout_exercise", (q) => q.eq("workoutExerciseId", workoutExercises._id))
          .collect();

        if (sets.length > 0) {
          return {
            date: workout.startedAt,
            sets: sets.sort((a, b) => a.setNumber - b.setNumber),
          };
        }
      }
    }

    return null;
  },
});
