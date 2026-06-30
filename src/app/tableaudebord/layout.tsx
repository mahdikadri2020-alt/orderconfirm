"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="md:ml-0" style={{ marginInlineEnd: "16rem" }}>
        <main className="p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
