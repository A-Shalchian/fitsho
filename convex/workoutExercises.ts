import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByWorkout = query({
  args: { workoutId: v.id("workouts") },
  handler: async (ctx, args) => {
    const workoutExercises = await ctx.db
      .query("workoutExercises")
      .withIndex("by_workout", (q) => q.eq("workoutId", args.workoutId))
      .collect();

    const withExerciseDetails = await Promise.all(
      workoutExercises.map(async (we) => {
        const exercise = await ctx.db.get(we.exerciseId);
        const sets = await ctx.db
          .query("sets")
          .withIndex("by_workout_exercise", (q) => q.eq("workoutExerciseId", we._id))
          .collect();
        return { ...we, exercise, sets };
      })
    );

    return withExerciseDetails.sort((a, b) => a.order - b.order);
  },
});

export const add = mutation({
  args: {
    workoutId: v.id("workouts"),
    exerciseId: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("workoutExercises")
      .withIndex("by_workout", (q) => q.eq("workoutId", args.workoutId))
      .collect();

    return await ctx.db.insert("workoutExercises", {
      workoutId: args.workoutId,
      exerciseId: args.exerciseId,
      order: existing.length,
    });
  },
});

export const remove = mutation({
  args: { workoutExerciseId: v.id("workoutExercises") },
  handler: async (ctx, args) => {
    const sets = await ctx.db
      .query("sets")
      .withIndex("by_workout_exercise", (q) => q.eq("workoutExerciseId", args.workoutExerciseId))
      .collect();

    for (const set of sets) {
      await ctx.db.delete(set._id);
    }

    await ctx.db.delete(args.workoutExerciseId);
  },
});
