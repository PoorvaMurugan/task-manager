const fs = require('fs');
const secretKey = "sk_test_92PRvRxWrZrXjn11Flk9KkVY3shGQchd2olRne7jRB";

async function main() {
  try {
    const response = await fetch("https://api.clerk.com/v1/users", {
      headers: { Authorization: `Bearer ${secretKey}` }
    });

    if (!response.ok) {
      console.error("Failed to fetch Clerk users");
      process.exit(1);
    }

    const users = await response.json();
    const map = {};

    users.forEach(u => {
      let name = "Unknown User";
      if (u.username) {
        name = u.username;
      } else if (u.first_name || u.last_name) {
        name = [u.first_name, u.last_name].filter(Boolean).join(" ");
      } else if (u.email_addresses && u.email_addresses.length > 0) {
        name = u.email_addresses[0].email_address;
      }
      map[u.id] = name;
    });

    const migrationContent = `import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Hardcoded map generated from Clerk API
const USER_MAP: Record<string, string> = ${JSON.stringify(map, null, 2)};

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
    return \`Updated \${totalUpdated} tasks across \${Object.keys(USER_MAP).length} users.\`;
  },
});
`;

    fs.writeFileSync('convex/migrations_generated.ts', migrationContent);
    console.log("Generated convex/migrations_generated.ts with user map.");

  } catch (err) {
    console.error("Script failed:", err);
  }
}

main();
