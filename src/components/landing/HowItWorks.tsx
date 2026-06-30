"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Send, MessageCircle, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const { t, lang } = useTranslation();

  const steps = [
    { icon: Plus, title: lang === "fr" ? "Créez une commande" : "أنشئ طلباً", desc: lang === "fr" ? "Ajoutez les informations du client dans votre tableau de bord." : "أضف معلومات العميل في لوحة التحكم." },
    { icon: Send, title: lang === "fr" ? "Envoi automatique" : "إرسال تلقائي", desc: lang === "fr" ? "Le système envoie automatiquement un message WhatsApp." : "يرسل النظام تلقائياً رسالة واتساب." },
    { icon: MessageCircle, title: lang === "fr" ? "Le client répond" : "العميل يرد", desc: lang === "fr" ? "Le client confirme (1) ou annule (2) la commande." : "يؤكد العميل (1) أو يلغي (2) الطلب." },
    { icon: CheckCircle2, title: lang === "fr" ? "Statut mis à jour" : "تحديث الحالة", desc: lang === "fr" ? "Le statut se met à jour automatiquement en temps réel." : "يتم تحديث الحالة تلقائياً في الوقت الفعلي." },
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">{t("howItWorks.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-whatsapp-500 flex items-center justify-center mb-4 shadow-lg shadow-whatsapp-500/25">
                  <step.icon size={28} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border-2 border-whatsapp-500 flex items-center justify-center text-sm font-bold text-whatsapp-500">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[calc(80%)] h-0.5 border-t-2 border-dashed border-whatsapp-200 dark:border-whatsapp-800" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
