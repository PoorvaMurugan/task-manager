"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
    const { user } = useUser();

    const stats = useQuery(api.tasks.getTaskStats, {
        userId: user?.id || "",
    });

    if (!stats) return <p>Loading...</p>;

    return (
        <div className="space-y-6">

            {/* Header */}
            <h1 className="text-3xl font-bold">
                Dashboard 📊
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Card>
                    <CardHeader>
                        <CardTitle>Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">
                        {stats.total}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Completed</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-green-600">
                        {stats.completed}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-orange-600">
                        {stats.pending}
                    </CardContent>
                </Card>

            </div>

            {/* Recent Tasks */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">

                    <CardTitle>Recent Tasks</CardTitle>

                    <Button asChild size="sm">
                        <Link href="/dashboard/all-tasks">
                            View All
                        </Link>
                    </Button>

                </CardHeader>

                <CardContent className="space-y-2">

                    {stats.recent.length === 0 && (
                        <p className="text-muted-foreground">
                            No tasks yet.
                        </p>
                    )}

                    {stats.recent.map(task => (
                        <div
                            key={task._id}
                            className="flex justify-between border-b pb-1 last:border-0"
                        >
                            <span
                                className={
                                    task.completed
                                        ? "line-through text-muted-foreground"
                                        : ""
                                }
                            >
                                {task.title}
                            </span>

                            {task.completed && (
                                <span className="text-green-600 text-sm">
                                    ✔ Done
                                </span>
                            )}
                        </div>
                    ))}

                </CardContent>
            </Card>

        </div>
    );
}
