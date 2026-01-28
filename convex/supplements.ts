import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("supplements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("supplements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return await ctx.db.insert("supplements", {
      userId: args.userId,
      name: args.name,
      order: existing.length,
    });
  },
});

export const remove = mutation({
  args: { supplementId: v.id("supplements") },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("supplementLogs")
      .withIndex("by_supplement_date", (q) => q.eq("supplementId", args.supplementId))
      .collect();

    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    await ctx.db.delete(args.supplementId);
  },
});

export const getLogsForDate = query({
  args: {
    userId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("supplementLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId).eq("date", args.date))
      .collect();
  },
});

export const toggleLog = mutation({
  args: {
    userId: v.string(),
    supplementId: v.id("supplements"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("supplementLogs")
      .withIndex("by_supplement_date", (q) =>
        q.eq("supplementId", args.supplementId).eq("date", args.date)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { taken: !existing.taken });
      return !existing.taken;
    } else {
      await ctx.db.insert("supplementLogs", {
        userId: args.userId,
        supplementId: args.supplementId,
        date: args.date,
        taken: true,
      });
      return true;
    }
  },
});
