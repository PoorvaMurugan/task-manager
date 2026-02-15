import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Hardcoded map generated from Clerk API
const USER_MAP: Record<string, string> = {
  "user_39DAdvbJUKpktPWzAaTR1uWHuSw": "Dharun",
  "user_39D7d23JSSNdodfQkm1wv8wZo9w": "RAZEEMA R C",
  "user_39Crj1hAGzaxVzw6nOmZ5UWG6P8": "Poorva Murugan"
};

export const applyNames = mutation({
  handler: async (ctx) => {
    let totalUpdated = 0;
    
    for (const [userId, name] of Object.entries(USER_MAP)) {
      // Find all tasks created by this user
      const tasks = await ctx.db
        .query("tasks")
        .filter((q) => q.eq(q.field("createdBy"), userId))
        .collect();
      
      for (const task of tasks) {
        // Only update if name is different or missing
        if (task.createdByName !== name) {
            await ctx.db.patch(task._id, { createdByName: name });
            totalUpdated++;
        }
      }
    }
    return `Updated ${totalUpdated} tasks across ${Object.keys(USER_MAP).length} users.`;
  },
});
