import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tasks: defineTable({
        title: v.string(),
        userId: v.string(),
        completed: v.boolean(),
    }),
});
