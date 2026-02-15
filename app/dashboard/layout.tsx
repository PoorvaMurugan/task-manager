"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen flex">

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center justify-between px-4 z-50">
                <Button variant="ghost" onClick={() => setOpen(!open)}>
                    ☰
                </Button>
                <span className="font-bold">Task Manager</span>
                <UserButton afterSignOutUrl="/sign-in" />
            </div>

            {/* Sidebar */}
            <aside
                className={`
          fixed md:static top-14 md:top-0
          h-[calc(100vh-56px)] md:h-screen
          w-64 bg-white border-r
          transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          z-40
        `}
            >
                <div className="p-5 flex flex-col h-full">

                    <h2 className="text-xl font-bold mb-6 hidden md:block">
                        Task Manager
                    </h2>

                    <nav className="flex flex-col gap-2 flex-1">
                        <Link href="/dashboard" className="hover:bg-muted px-3 py-2 rounded">
                            Dashboard
                        </Link>

                        <Link href="/dashboard/my-tasks" className="hover:bg-muted px-3 py-2 rounded">
                            My Tasks
                        </Link>

                        <Link href="/dashboard/all-tasks" className="hover:bg-muted px-3 py-2 rounded">
                            All Tasks
                        </Link>
                    </nav>

                    <div className="hidden md:block border-t pt-4">
                        <UserButton afterSignOutUrl="/sign-in" />
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 bg-muted/40">
                {children}
            </main>
        </div>
    );
}
