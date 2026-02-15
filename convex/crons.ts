import { cronJobs } from "convex/server";
// import { api } from "./_generated/api";

const crons = cronJobs();

// crons.interval(
//     "sync-clerk-users",
//     { minutes: 1 }, // Run every minute to keep names fresh
//     api.actions.syncClerk
// );

export default crons;

