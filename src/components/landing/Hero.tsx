"use client";

"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MessageCircle, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function Hero() {
  const { t, lang, dir } = useTranslation();
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-whatsapp-50/50 to-transparent dark:from-whatsapp-900/10 dark:to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-whatsapp-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-whatsapp-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in" dir={dir}>
            <div className="inline-flex items-center gap-2 bg-whatsapp-100 dark:bg-whatsapp-900/30 text-whatsapp-700 dark:text-whatsapp-300 px-4 py-2 rounded-full text-sm font-medium">
              <MessageCircle size={16} />
              <span>{lang === "fr" ? "Algérie 🇩🇿" : "الجزائر 🇩🇿"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              {t("hero.title")}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/demande-compte">
                <Button size="lg" className="gap-2">
                  {t("hero.cta1")}
                  {dir === "rtl" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Button>
              </Link>
              <Link href="/connexion">
                <Button variant="outline" size="lg">
                  {t("hero.cta2")}
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 border-2 border-whatsapp-500/30 text-whatsapp-600 dark:text-whatsapp-400 hover:bg-whatsapp-50 dark:hover:bg-whatsapp-900/20"
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
                    alert("Impossible de lancer la démo. Réessayez plus tard.");
                  } finally {
                    setDemoLoading(false);
                  }
                }}
              >
                <Play size={18} /> Essayer la Démo
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{lang === "fr" ? "Sans engagement" : "بدون التزام"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{lang === "fr" ? "Configuration rapide" : "إعداد سريع"}</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center animate-slide-up">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-whatsapp-500 to-whatsapp-700 rounded-3xl blur-2xl opacity-20" />
              <div className="relative bg-card border border-border rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-whatsapp-500 flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{lang === "fr" ? "WhatsApp Confirmation" : "تأكيد واتساب"}</p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "fr" ? "Message automatique" : "رسالة تلقائية"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-whatsapp-50 dark:bg-whatsapp-900/20 rounded-2xl p-4 rounded-tr-sm">
                    <p className="text-sm leading-relaxed">
                      {lang === "fr"
                        ? "السلام عليكم، نود تأكيد طلبكم من {{store_name}}. للرد: 1 للتأكيد، 2 للإلغاء."
                        : "Bonjour ! Nous souhaitons confirmer votre commande de {{store_name}}. Répondez 1 pour confirmer, 2 pour annuler."}
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded-2xl p-4 rounded-tl-sm self-end" dir="rtl">
                    <p className="text-sm">1</p>
                  </div>
                  <div className="bg-whatsapp-50 dark:bg-whatsapp-900/20 rounded-2xl p-4 rounded-tr-sm">
                    <p className="text-sm">
                      {lang === "fr" ? "✅ Commande confirmée ! Merci." : "✅ تم تأكيد الطلب! شكراً."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
