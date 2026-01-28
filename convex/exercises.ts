import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    muscleGroup: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.muscleGroup) {
      return await ctx.db
        .query("exercises")
        .withIndex("by_muscle_group", (q) => q.eq("muscleGroup", args.muscleGroup!))
        .collect();
    }
    return await ctx.db.query("exercises").collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("exercises").first();
    if (existing) return "Already seeded";

    const exercises = [
      { name: "Bench Press", muscleGroup: "chest", equipment: "barbell" },
      { name: "Incline Bench Press", muscleGroup: "chest", equipment: "barbell" },
      { name: "Dumbbell Fly", muscleGroup: "chest", equipment: "dumbbell" },
      { name: "Push Up", muscleGroup: "chest", equipment: "bodyweight" },
      { name: "Cable Crossover", muscleGroup: "chest", equipment: "cable" },
      { name: "Incline Dumbbell Press", muscleGroup: "chest", equipment: "dumbbell" },
      { name: "Chest Dip", muscleGroup: "chest", equipment: "bodyweight" },

      { name: "Deadlift", muscleGroup: "back", equipment: "barbell" },
      { name: "Barbell Row", muscleGroup: "back", equipment: "barbell" },
      { name: "Pull Up", muscleGroup: "back", equipment: "bodyweight" },
      { name: "Lat Pulldown", muscleGroup: "back", equipment: "cable" },
      { name: "Seated Row", muscleGroup: "back", equipment: "cable" },
      { name: "Dumbbell Row", muscleGroup: "back", equipment: "dumbbell" },
      { name: "T-Bar Row", muscleGroup: "back", equipment: "barbell" },

      { name: "Overhead Press", muscleGroup: "shoulders", equipment: "barbell" },
      { name: "Lateral Raise", muscleGroup: "shoulders", equipment: "dumbbell" },
      { name: "Face Pull", muscleGroup: "shoulders", equipment: "cable" },
      { name: "Arnold Press", muscleGroup: "shoulders", equipment: "dumbbell" },
      { name: "Front Raise", muscleGroup: "shoulders", equipment: "dumbbell" },
      { name: "Reverse Fly", muscleGroup: "shoulders", equipment: "dumbbell" },

      { name: "Barbell Curl", muscleGroup: "biceps", equipment: "barbell" },
      { name: "Dumbbell Curl", muscleGroup: "biceps", equipment: "dumbbell" },
      { name: "Hammer Curl", muscleGroup: "biceps", equipment: "dumbbell" },
      { name: "Preacher Curl", muscleGroup: "biceps", equipment: "machine" },
      { name: "Incline Curl", muscleGroup: "biceps", equipment: "dumbbell" },
      { name: "Cable Curl", muscleGroup: "biceps", equipment: "cable" },

      { name: "Tricep Pushdown", muscleGroup: "triceps", equipment: "cable" },
      { name: "Skull Crusher", muscleGroup: "triceps", equipment: "barbell" },
      { name: "Tricep Dip", muscleGroup: "triceps", equipment: "bodyweight" },
      { name: "Overhead Tricep Extension", muscleGroup: "triceps", equipment: "dumbbell" },
      { name: "Close Grip Bench Press", muscleGroup: "triceps", equipment: "barbell" },
      { name: "Tricep Kickback", muscleGroup: "triceps", equipment: "dumbbell" },

      { name: "Squat", muscleGroup: "legs", equipment: "barbell" },
      { name: "Leg Press", muscleGroup: "legs", equipment: "machine" },
      { name: "Romanian Deadlift", muscleGroup: "legs", equipment: "barbell" },
      { name: "Leg Curl", muscleGroup: "legs", equipment: "machine" },
      { name: "Leg Extension", muscleGroup: "legs", equipment: "machine" },
      { name: "Lunges", muscleGroup: "legs", equipment: "bodyweight" },
      { name: "Bulgarian Split Squat", muscleGroup: "legs", equipment: "dumbbell" },
      { name: "Hack Squat", muscleGroup: "legs", equipment: "machine" },

      { name: "Hip Thrust", muscleGroup: "glutes", equipment: "barbell" },
      { name: "Glute Bridge", muscleGroup: "glutes", equipment: "bodyweight" },
      { name: "Cable Kickback", muscleGroup: "glutes", equipment: "cable" },

      { name: "Plank", muscleGroup: "core", equipment: "bodyweight" },
      { name: "Crunch", muscleGroup: "core", equipment: "bodyweight" },
      { name: "Hanging Leg Raise", muscleGroup: "core", equipment: "bodyweight" },
      { name: "Cable Woodchop", muscleGroup: "core", equipment: "cable" },
      { name: "Russian Twist", muscleGroup: "core", equipment: "bodyweight" },
      { name: "Ab Wheel Rollout", muscleGroup: "core", equipment: "bodyweight" },

      { name: "Standing Calf Raise", muscleGroup: "calves", equipment: "machine" },
      { name: "Seated Calf Raise", muscleGroup: "calves", equipment: "machine" },

      { name: "Wrist Curl", muscleGroup: "forearms", equipment: "dumbbell" },
      { name: "Reverse Wrist Curl", muscleGroup: "forearms", equipment: "dumbbell" },
      { name: "Farmer's Walk", muscleGroup: "forearms", equipment: "dumbbell" },
    ];

    for (const exercise of exercises) {
      await ctx.db.insert("exercises", {
        ...exercise,
        isCustom: false,
      });
    }

    return "Seeded " + exercises.length + " exercises";
  },
});
