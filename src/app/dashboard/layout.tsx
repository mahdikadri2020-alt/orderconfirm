"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (error || !user) {
        router.replace("/connexion");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (!profile || profile.role !== "customer") {
        router.replace("/connexion");
        return;
      }
      setChecked(true);
    }).catch(() => router.replace("/connexion"));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/connexion");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <CustomerSidebar />
      <div className="md:ml-0" style={{ marginInlineEnd: "16rem" }}>
        <main className="p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
