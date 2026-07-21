"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin-left] duration-300 ease-in-out",
          "ml-0 lg:ml-[240px]",
          sidebarCollapsed && "lg:ml-[72px]"
        )}
      >
        <Header />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
