"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useDemo() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      setIsDemo(data?.user?.email === "demo@orderconfirm.com");
    };
    check();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsDemo(session?.user?.email === "demo@orderconfirm.com");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const showDemoToast = () => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-6 right-6 z-[100] bg-amber-600 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium";
    toast.textContent = "Cette fonctionnalité est désactivée en mode Démo.";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  return { isDemo, showDemoToast };
}
