"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { MessageCircle, RefreshCw, BarChart3, Workflow, Truck, Globe } from "lucide-react";

export function Features() {
  const { t, lang } = useTranslation();

  const features = [
    {
      icon: MessageCircle,
      title: lang === "fr" ? "Confirmation WhatsApp" : "تأكيد عبر واتساب",
      desc: lang === "fr" ? "Envoyez automatiquement des messages de confirmation à vos clients via WhatsApp." : "أرسل رسائل تأكيد تلقائية لعملائك عبر واتساب.",
    },
    {
      icon: RefreshCw,
      title: lang === "fr" ? "Relances Automatiques" : "تذكير تلقائي",
      desc: lang === "fr" ? "Relances automatiques pour les clients qui n'ont pas encore répondu." : "تذكير تلقائي للعملاء الذين لم يردوا بعد.",
    },
    {
      icon: Truck,
      title: lang === "fr" ? "Réduction des Coûts" : "تقليل التكاليف",
      desc: lang === "fr" ? "Évitez les frais de livraison inutiles en confirmant les commandes avant expédition." : "تجنب رسوم التوصيل غير الضرورية بتأكيد الطلبات قبل الشحن.",
    },
    {
      icon: BarChart3,
      title: lang === "fr" ? "Tableau de Bord" : "لوحة تحكم",
      desc: lang === "fr" ? "Suivez vos performances avec des statistiques détaillées et des graphiques." : "تابع أدائك مع إحصائيات مفصلة ورسوم بيانية.",
    },
    {
      icon: Workflow,
      title: lang === "fr" ? "Export Livreurs" : "تصدير لشركات التوصيل",
      desc: lang === "fr" ? "Exportez vers Yalidine, ZR Express, Ecotrans et Noest en un clic." : "صدّر إلى ياليدين و ZR Express و Ecotrans و Noest بنقرة واحدة.",
    },
    {
      icon: Globe,
      title: lang === "fr" ? "Support Arabe" : "دعم العربية",
      desc: lang === "fr" ? "Interface en français et en arabe." : "الواجهة بالفرنسية والعربية.",
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">{t("features.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-whatsapp-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-whatsapp-100 dark:bg-whatsapp-900/30 flex items-center justify-center mb-4 group-hover:bg-whatsapp-500 group-hover:text-white transition-colors">
                <feature.icon size={24} className="text-whatsapp-600 dark:text-whatsapp-400 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
