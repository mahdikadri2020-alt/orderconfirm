"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X, Moon, Sun, Globe, Package, Users, User, Monitor } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function CustomerSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const { lang, toggleLang, t, dir } = useTranslation();
  const { dark, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsDemo(data?.user?.email === "demo@orderconfirm.com");
    });
  }, []);

  const links = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { href: "/dashboard/orders", icon: ShoppingBag, label: t("nav.orders") },
    { href: "/dashboard/products", icon: Package, label: "Produits" },
    { href: "/dashboard/customers", icon: Users, label: "Clients" },
    { href: "/dashboard/profile", icon: User, label: "Profil" },
    { href: "/dashboard/settings", icon: Settings, label: t("nav.settings") },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/connexion");
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 bg-card border border-border rounded-lg"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border p-4 animate-slide-down" dir={dir}>
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-whatsapp-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OC</span>
                </div>
                <span className="font-bold">OrderConfirm</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-muted rounded-lg">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    isActive(link.href)
                      ? "bg-whatsapp-50 dark:bg-whatsapp-900/20 text-whatsapp-600 dark:text-whatsapp-400 font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={toggleLang} className="p-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-1 text-sm">
                  <Globe size={18} />
                  {lang === "fr" ? "AR" : "FR"}
                </button>
              </div>
              <button onClick={handleLogout} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors", isDemo ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20" : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20")}>
                <LogOut size={18} />
                {!collapsed && (isDemo ? "Quitter la Démo" : t("nav.logout"))}
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={cn(
          "hidden md:flex flex-col fixed right-0 top-0 bottom-0 bg-card border-l border-border transition-all duration-300 z-30",
          collapsed ? "w-16" : "w-64"
        )}
        dir={dir}
      >
        <div className={cn("flex items-center p-4 border-b border-border", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-whatsapp-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">OC</span>
              </div>
              <span className="font-bold">OrderConfirm</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-whatsapp-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">OC</span>
            </div>
          )}
        </div>

        {isDemo && (
          <div className={cn("px-3 pt-3", collapsed && "flex flex-col items-center")}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <Monitor size={14} />
              {!collapsed && "Mode Démo"}
            </div>
          </div>
        )}

        <nav className={cn("flex-1 p-2 space-y-1", collapsed && "flex flex-col items-center")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                collapsed && "justify-center px-2",
                isActive(link.href)
                  ? "bg-whatsapp-50 dark:bg-whatsapp-900/20 text-whatsapp-600 dark:text-whatsapp-400 font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon size={18} />
              {!collapsed && link.label}
            </Link>
          ))}
        </nav>

        <div className={cn("border-t border-border p-2 space-y-1", collapsed && "flex flex-col items-center")}>
          <button onClick={toggleTheme} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full", collapsed && "justify-center")}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && (dark ? t("common.light") || "Light" : t("common.dark") || "Dark")}
          </button>
          <button onClick={toggleLang} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full", collapsed && "justify-center")}>
            <Globe size={18} />
            {!collapsed && (lang === "fr" ? "العربية" : "Français")}
          </button>
          <button onClick={handleLogout} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors", collapsed && "justify-center")}>
            <LogOut size={18} />
            {!collapsed && t("nav.logout")}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("hidden lg:flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors w-full mt-2", collapsed && "justify-center")}
          >
            {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
