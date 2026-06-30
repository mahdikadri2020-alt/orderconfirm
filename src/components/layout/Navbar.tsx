"use client";

import { useState } from "react";
import { Menu, X, Moon, Sun, Globe, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/hooks/useTheme";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { lang, toggleLang, t, dir } = useTranslation();
  const { dark, toggleTheme } = useTheme();
  const router = useRouter();

  const links = [
    { href: "#features", label: t("nav.features") },
    { href: "#faq", label: t("nav.faq") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-whatsapp-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">OC</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              Order<span className="text-whatsapp-500">Confirm</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition-colors" title={dark ? "Light mode" : "Dark mode"}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={toggleLang} className="p-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-1 text-sm" title={lang === "fr" ? "العربية" : "Français"}>
              <Globe size={18} />
              <span className="hidden sm:inline">{lang === "fr" ? "AR" : "FR"}</span>
            </button>
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-auto border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground/50">
                Admin
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs border-whatsapp-500/30 text-whatsapp-600 dark:text-whatsapp-400"
              loading={demoLoading}
              onClick={async () => {
                setDemoLoading(true);
                try {
                  const res = await fetch("/api/demo/login", { method: "POST" });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error);
                  await supabase.auth.setSession(data.session);
                  router.push("/dashboard");
                } catch {
                  alert("Impossible de lancer la démo.");
                } finally {
                  setDemoLoading(false);
                }
              }}
            >
              <Play size={14} /> Démo
            </Button>
            <Link href="/connexion">
              <Button variant="ghost" size="sm">{t("nav.login")}</Button>
            </Link>
            <Link href="/demande-compte">
              <Button size="sm" className="hidden sm:flex">{t("nav.requestAccount")}</Button>
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border p-4 space-y-3 animate-slide-down" dir={dir}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground py-2"
            >
              {link.label}
            </a>
          ))}
          <Link href="/demande-compte" onClick={() => setMobileOpen(false)}>
            <Button className="w-full">{t("nav.requestAccount")}</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
