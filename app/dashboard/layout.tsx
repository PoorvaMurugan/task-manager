import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">

            {/* Sidebar */}
            <aside className="w-64 border-r bg-background p-5 flex flex-col">

                {/* Logo */}
                <h2 className="text-2xl font-bold mb-8">
                    Task Manager
                </h2>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 flex-1">

                    <Button variant="ghost" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <Link href="/dashboard/tasks">Tasks</Link>
                    </Button>

                </nav>

                {/* Profile */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between w-full">

                        <UserButton
                            afterSignOutUrl="/sign-in"
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-10 h-10",
                                },
                            }}
                        />

                        <span className="text-sm font-medium">
                            Profile
                        </span>

                    </div>


                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-muted/40 p-6">
                {children}
            </main>

        </div>
    );
}
