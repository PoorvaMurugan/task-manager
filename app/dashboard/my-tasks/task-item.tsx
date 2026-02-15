"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface TaskItemProps {
    task: {
        _id: Id<"tasks">;
        title: string;
        completed: boolean;
    };
}

export function TaskItem({ task }: TaskItemProps) {
    const [editTitle, setEditTitle] = useState(task.title);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleTask = useMutation(api.tasks.toggleTask);
    const deleteTask = useMutation(api.tasks.deleteTask);
    const updateTask = useMutation(api.tasks.updateTask);

    const handleSave = async () => {
        if (!editTitle.trim()) return;

        await updateTask({
            id: task._id,
            title: editTitle,
        });
        setIsDialogOpen(false);
    };

    return (
        <Card>
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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" onClick={() => setEditTitle(task.title)}>
                                Edit
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Task</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3">
                                <Input
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSave();
                                    }}
                                />

                                <Button
                                    className="w-full"
                                    onClick={handleSave}
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
                        onClick={() => deleteTask({ id: task._id })}
                    >
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
