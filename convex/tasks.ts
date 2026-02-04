import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* CREATE */
export const createTask = mutation({
    args: {
        title: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("tasks", {
            title: args.title,
            userId: args.userId,
            completed: false,
        });
    },
});

/* READ */
export const getTasks = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tasks")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();
    },
});

/* UPDATE */
export const toggleTask = mutation({
    args: {
        id: v.id("tasks"),
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            completed: args.completed,
        });
    },
});

/* DELETE */
export const deleteTask = mutation({
    args: {
        id: v.id("tasks"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// DASHBOARD STATS
export const getTaskStats = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const tasks = await ctx.db
            .query("tasks")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();

        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        return {
            total,
            completed,
            pending,
            recent: tasks.slice(0, 5),
        };
    },
});

// UPDATE TITLE
export const updateTask = mutation({
    args: {
        id: v.id("tasks"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            title: args.title,
        });
    },
});
