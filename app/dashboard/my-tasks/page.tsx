"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskItem } from "./task-item";

export default function MyTasksPage() {
    const { user } = useUser();
    const [title, setTitle] = useState("");

    const tasks = useQuery(api.tasks.getMyTasks, {
        userId: user?.id || "",
    });

    const createTask = useMutation(api.tasks.createTask);

    async function addTask() {
        if (!title.trim() || !user) return;

        const username =
            user.fullName ||
            user.firstName ||
            user.primaryEmailAddress?.emailAddress ||
            user.username ||
            "Anonymous";

        console.log("Calling createTask with:", {
            title,
            createdBy: user.id,
            createdByName: username,
            assignedTo: user.id,
        });

        await createTask({
            title,
            createdBy: user.id,
            createdByName: username,
            assignedTo: user.id,
        });



        setTitle("");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-5">
            <h1 className="text-3xl font-bold">My Tasks 📝</h1>

            {/* Add Task */}
            <div className="flex gap-2">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") addTask();
                    }}
                />

                <Button onClick={addTask}>Add</Button>
            </div>

            {/* Task List */}
            {tasks?.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                    No tasks yet. Add your first task above!
                </p>
            )}

            <div className="space-y-4">
                {tasks?.map((task) => (
                    <TaskItem key={task._id} task={task} />
                ))}
            </div>
        </div>
    );
}

