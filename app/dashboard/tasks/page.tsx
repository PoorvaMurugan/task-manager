"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function TasksPage() {
    const { user } = useUser();

    const [title, setTitle] = useState("");
    const [editTitle, setEditTitle] = useState("");

    const tasks = useQuery(api.tasks.getTasks, {
        userId: user?.id || "",
    });

    const createTask = useMutation(api.tasks.createTask);
    const toggleTask = useMutation(api.tasks.toggleTask);
    const deleteTask = useMutation(api.tasks.deleteTask);
    const updateTask = useMutation(api.tasks.updateTask);

    async function addTask() {
        if (!title.trim()) return;

        await createTask({
            title,
            userId: user!.id,
        });

        setTitle("");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-5">

            <h1 className="text-3xl font-bold">
                My Tasks 📝
            </h1>

            {/* Add Task */}
            <div className="flex gap-2">

                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task..."
                />

                <Button onClick={addTask}>
                    Add
                </Button>

            </div>

            {/* Task List */}
            {tasks?.map(task => (
                <Card key={task._id}>

                    <CardContent className="flex justify-between items-center py-4">

                        <span
                            className={
                                task.completed
                                    ? "line-through text-muted-foreground"
                                    : ""
                            }
                        >
                            {task.title}
                        </span>

                        <div className="flex gap-2">

                            {/* DONE */}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    toggleTask({
                                        id: task._id,
                                        completed: !task.completed,
                                    })
                                }
                            >
                                {task.completed ? "Undo" : "Done"}
                            </Button>

                            {/* EDIT */}
                            <Dialog>
                                <DialogTrigger asChild>

                                    <Button size="sm" variant="secondary">
                                        Edit
                                    </Button>

                                </DialogTrigger>

                                <DialogContent>

                                    <DialogHeader>
                                        <DialogTitle>
                                            Edit Task
                                        </DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-3">

                                        <Input
                                            defaultValue={task.title}
                                            onChange={(e) =>
                                                setEditTitle(e.target.value)
                                            }
                                        />

                                        <Button
                                            className="w-full"
                                            onClick={async () => {
                                                if (!editTitle.trim()) return;

                                                await updateTask({
                                                    id: task._id,
                                                    title: editTitle,
                                                });
                                            }}
                                        >
                                            Save
                                        </Button>

                                    </div>

                                </DialogContent>
                            </Dialog>

                            {/* DELETE */}
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                    deleteTask({ id: task._id })
                                }
                            >
                                Delete
                            </Button>

                        </div>

                    </CardContent>

                </Card>
            ))}

        </div>
    );
}
