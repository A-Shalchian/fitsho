import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

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

export const listPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    muscleGroup: v.optional(v.string()),
    equipment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const baseQuery = args.muscleGroup
      ? ctx.db.query("exercises").withIndex("by_muscle_group", (q) => q.eq("muscleGroup", args.muscleGroup!))
      : ctx.db.query("exercises");

    const results = await baseQuery.order("asc").paginate(args.paginationOpts);

    const page = args.equipment
      ? results.page.filter((e) => e.equipment === args.equipment)
      : results.page;

    return { ...results, page };
  },
});

export const getEquipmentList = query({
  args: {},
  handler: async (ctx) => {
    const exercises = await ctx.db.query("exercises").collect();
    return [...new Set(exercises.map((e) => e.equipment))].sort();
  },
});

export const getById = query({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const exercises = await ctx.db.query("exercises").collect();
    const searchLower = args.query.toLowerCase();
    return exercises.filter((e) =>
      e.name.toLowerCase().includes(searchLower)
    );
  },
});

export const getMuscleGroups = query({
  args: {},
  handler: async (ctx) => {
    const exercises = await ctx.db.query("exercises").collect();
    return [...new Set(exercises.map((e) => e.muscleGroup))].sort();
  },
});

export const insertFromApi = mutation({
  args: {
    name: v.string(),
    muscleGroup: v.string(),
    secondaryMuscles: v.optional(v.array(v.string())),
    equipment: v.string(),
    gifUrl: v.optional(v.string()),
    instructions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("exercises")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("exercises", {
      ...args,
      isCustom: false,
    });
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const exercises = await ctx.db.query("exercises").collect();
    for (const exercise of exercises) {
      await ctx.db.delete(exercise._id);
    }
    return `Deleted ${exercises.length} exercises`;
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const exercises = await ctx.db.query("exercises").collect();
    return exercises.length;
  },
});

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildExerciseDbUrl(args: { equipment?: string; bodyPart?: string; target?: string }): string {
  const base = "https://exercisedb.p.rapidapi.com/exercises";
  if (args.equipment) return `${base}/equipment/${encodeURIComponent(args.equipment)}`;
  if (args.bodyPart) return `${base}/bodyPart/${encodeURIComponent(args.bodyPart)}`;
  if (args.target) return `${base}/target/${encodeURIComponent(args.target)}`;
  return base;
}

function shouldSkipExercise(
  ex: { bodyPart: string; target: string; equipment: string },
  filters: { equipment?: string; bodyPart?: string; target?: string }
): boolean {
  if (filters.equipment && filters.bodyPart && ex.bodyPart !== filters.bodyPart) return true;
  if (filters.equipment && filters.target && ex.target !== filters.target) return true;
  if (filters.bodyPart && filters.equipment && ex.equipment !== filters.equipment) return true;
  if (filters.bodyPart && filters.target && ex.target !== filters.target) return true;
  return false;
}

export const seedFromExerciseDb = action({
  args: {
    apiKey: v.string(),
    equipment: v.optional(v.string()),
    bodyPart: v.optional(v.string()),
    target: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const maxExercises = args.limit ?? 100;
    const baseUrl = buildExerciseDbUrl(args);
    let totalInserted = 0;
    let offset = 0;
    let apiCalls = 0;

    while (totalInserted < maxExercises && apiCalls < 100) {
      const response = await fetch(`${baseUrl}?limit=10&offset=${offset}`, {
        headers: {
          "X-RapidAPI-Key": args.apiKey,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      });
      apiCalls++;

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const exercises = await response.json();
      if (exercises.length === 0) break;

      for (const ex of exercises) {
        if (totalInserted >= maxExercises) break;
        if (shouldSkipExercise(ex, args)) continue;

        await ctx.runMutation(api.exercises.insertFromApi, {
          name: capitalize(ex.name),
          muscleGroup: ex.target,
          secondaryMuscles: ex.secondaryMuscles ?? [],
          equipment: ex.equipment,
          gifUrl: ex.gifUrl,
          instructions: ex.instructions ?? [],
        });
        totalInserted++;
      }

      offset += 10;
    }

    return `Seeded ${totalInserted} exercises (used ${apiCalls} API calls)`;
  },
});

export const createCustom = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    muscleGroup: v.string(),
    equipment: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exercises", {
      ...args,
      isCustom: true,
    });
  },
});
