import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

/* =========================
   CREATE TASK
========================= */
export const createTask = mutation({
    args: {
        title: v.string(),
        assignedTo: v.string(),
        createdBy: v.string(),
        createdByName: v.string(),
    },
    handler: async (ctx, args) => {
        console.log("Creating task:", args);

        // Ensure user exists and has a shortId
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq("clerkId", args.createdBy))
            .unique();

        if (!existingUser) {
            const allUsers = await ctx.db.query("users").collect();
            const nextIdNumber = allUsers.length + 1;
            const shortId = `USR-${nextIdNumber.toString().padStart(3, '0')}`;

            await ctx.db.insert("users", {
                clerkId: args.createdBy,
                name: args.createdByName,
                shortId,
            });
        }

        await ctx.db.insert("tasks", {
            title: args.title,
            userId: args.createdBy, // Mapping createdBy to userId for compatibility
            username: args.createdByName,
            createdBy: args.createdBy,
            createdByName: args.createdByName,
            assignedTo: args.assignedTo,
            completed: false,
        });
    },
});

/* =========================
   MY TASKS (assigned to me)
========================= */
export const getMyTasks = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tasks")
            .filter(q => q.eq(q.field("assignedTo"), args.userId))
            .collect();
    },
});

/* =========================
   ALL TASKS (dashboard)
========================= */
export const getAllTasks = query({
    handler: async (ctx) => {
        const tasks = await ctx.db.query("tasks").collect();

        // Enrich tasks with user shortIds
        const result = await Promise.all(tasks.map(async task => {
            const user = await ctx.db
                .query("users")
                .withIndex("by_clerkId", q => q.eq("clerkId", task.createdBy))
                .unique();

            return {
                ...task,
                userShortId: user?.shortId || "USR-???"
            };
        }));

        return result;
    },
});

/* =========================
   TOGGLE COMPLETED
========================= */
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

/* =========================
   UPDATE TITLE
========================= */
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

/* =========================
   DELETE TASK
========================= */
export const deleteTask = mutation({
    args: {
        id: v.id("tasks"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

/* =========================
   TASK STATS (MY TASKS)
========================= */
export const getTaskStats = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const tasks = await ctx.db
            .query("tasks")
            .filter(q => q.eq(q.field("assignedTo"), args.userId))
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

/* =========================
   MIGRATION: APPLY NAMES
========================= */
const USER_MAP: Record<string, string> = {
    "user_39DAdvbJUKpktPWzAaTR1uWHuSw": "Dharun",
    "user_39D7d23JSSNdodfQkm1wv8wZo9w": "RAZEEMA R C",
    "user_39Crj1hAGzaxVzw6nOmZ5UWG6P8": "Poorva Murugan"
};

export const applyNames = mutation({
    args: {},
    handler: async (ctx) => {
        let totalUpdated = 0;

        for (const [userId, name] of Object.entries(USER_MAP)) {
            const tasks = await ctx.db
                .query("tasks")
                .filter((q) => q.eq(q.field("createdBy"), userId))
                .collect();

            for (const task of tasks) {
                if (task.createdByName !== name) {
                    await ctx.db.patch(task._id, {
                        createdByName: name,
                        username: name // Sync both fields
                    });
                    totalUpdated++;
                }
            }
        }
        return `Updated ${totalUpdated} tasks.`;
    },
});

/* =========================
   MIGRATION: SYNC USERS & IDS
========================= */
export const syncUsers = mutation({
    handler: async (ctx) => {
        const tasks = await ctx.db.query("tasks").collect();
        const uniqueClerkIds = Array.from(new Set(tasks.map(t => t.createdBy)));

        let createdCount = 0;

        for (const clerkId of uniqueClerkIds) {
            const existing = await ctx.db
                .query("users")
                .withIndex("by_clerkId", q => q.eq("clerkId", clerkId))
                .unique();

            if (!existing) {
                const allUsers = await ctx.db.query("users").collect();
                const nextIdNumber = allUsers.length + 1;
                const shortId = `USR-${nextIdNumber.toString().padStart(3, '0')}`;

                const taskWithUser = tasks.find(t => t.createdBy === clerkId);
                const name = taskWithUser?.createdByName || taskWithUser?.username || "Unknown User";

                await ctx.db.insert("users", {
                    clerkId,
                    name,
                    shortId,
                });
                createdCount++;
            }
        }

        return `Created ${createdCount} user records with unique IDs.`;
    }
});
