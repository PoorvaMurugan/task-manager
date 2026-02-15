import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tasks: defineTable({
        title: v.string(),
        userId: v.string(),
        username: v.string(),

        createdBy: v.string(),
        createdByName: v.string(),

        assignedTo: v.string(),
        completed: v.boolean(),
    }).index("by_createdBy", ["createdBy"]),

    users: defineTable({
        clerkId: v.string(),
        name: v.string(),
        shortId: v.string(), // e.g. "USR-001"
    }).index("by_clerkId", ["clerkId"]),
});

