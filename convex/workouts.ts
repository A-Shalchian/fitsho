import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getActive = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("completedAt"), undefined))
      .first();
  },
});

export const getByDate = query({
  args: {
    userId: v.string(),
    startOfDay: v.number(),
    endOfDay: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("startedAt"), args.startOfDay),
          q.lt(q.field("startedAt"), args.endOfDay)
        )
      )
      .collect();
  },
});

export const getWorkoutDays = query({
  args: {
    userId: v.string(),
    startOfMonth: v.number(),
    endOfMonth: v.number(),
  },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("startedAt"), args.startOfMonth),
          q.lt(q.field("startedAt"), args.endOfMonth)
        )
      )
      .collect();
    return workouts.map((w) => w.startedAt);
  },
});

export const start = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workouts", {
      userId: args.userId,
      name: args.name,
      startedAt: Date.now(),
    });
  },
});

export const complete = mutation({
  args: { workoutId: v.id("workouts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workoutId, {
      completedAt: Date.now(),
    });
  },
});

export const getById = query({
  args: { workoutId: v.id("workouts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workoutId);
  },
});

export const saveWorkout = mutation({
  args: {
    userId: v.string(),
    startedAt: v.number(),
    exercises: v.array(
      v.object({
        exerciseId: v.id("exercises"),
        sets: v.array(
          v.object({
            weight: v.number(),
            reps: v.number(),
            rpe: v.optional(v.number()),
            isWarmup: v.boolean(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const workoutId = await ctx.db.insert("workouts", {
      userId: args.userId,
      startedAt: args.startedAt,
      completedAt: Date.now(),
    });

    for (let i = 0; i < args.exercises.length; i++) {
      const ex = args.exercises[i];
      const workoutExerciseId = await ctx.db.insert("workoutExercises", {
        workoutId,
        exerciseId: ex.exerciseId,
        order: i,
      });

      for (let j = 0; j < ex.sets.length; j++) {
        const set = ex.sets[j];
        await ctx.db.insert("sets", {
          workoutExerciseId,
          setNumber: j + 1,
          weight: set.weight,
          reps: set.reps,
          rpe: set.rpe,
          isWarmup: set.isWarmup,
          completedAt: Date.now(),
        });
      }
    }

    return workoutId;
  },
});
