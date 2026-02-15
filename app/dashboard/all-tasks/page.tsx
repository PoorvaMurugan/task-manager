"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function AllTasksPage() {
    const { user } = useUser();
    const tasks = useQuery(api.tasks.getAllTasks);

    return (
        <div className="max-w-3xl mx-auto space-y-5">
            <h1 className="text-3xl font-bold">All Tasks 🌐</h1>

            <p className="text-muted-foreground text-sm">
                View-only overview of every task across all users.
            </p>

            {tasks?.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                    No tasks have been created yet.
                </p>
            )}

            {tasks?.map(task => (
                <Card key={task._id}>
                    <CardContent className="flex justify-between items-center py-4">
                        <div className="space-y-1">
                            <p
                                className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""
                                    }`}
                            >
                                {task.title}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                👤 <span className="font-bold text-primary">{task.userShortId}</span> - {
                                    task.createdBy === user?.id
                                        ? "You"
                                        : (task.createdByName === "Legacy User" || !task.createdByName)
                                            ? `User-${task.createdBy.slice(-4).toUpperCase()}`
                                            : task.createdByName
                                }
                            </p>
                        </div>

                        <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${task.completed
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                                }`}
                        >
                            {task.completed ? "✔ Done" : "⏳ Pending"}
                        </span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
