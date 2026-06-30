"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const { t, lang } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: lang === "fr" ? "Comment fonctionne la confirmation WhatsApp ?" : "كيف يعمل تأكيد واتساب؟",
      a: lang === "fr" ? "Lorsque vous créez une commande, notre système envoie automatiquement un message WhatsApp au client. Il lui suffit de répondre 1 pour confirmer ou 2 pour annuler." : "عند إنشاء طلب، يرسل نظامنا تلقائياً رسالة واتساب للعميل. كل ما عليه فعله هو الرد برقم 1 للتأكيد أو 2 للإلغاء.",
    },
    {
      q: lang === "fr" ? "Puis-je connecter ma société de livraison ?" : "هل يمكنني ربط شركة التوصيل الخاصة بي؟",
      a: lang === "fr" ? "Oui, nous supportons l'export CSV vers Yalidine, ZR Express, Ecotrans et Noest. Vous pouvez exporter les commandes confirmées en un clic." : "نعم، ندعم تصدير CSV إلى ياليدين و ZR Express و Ecotrans و Noest. يمكنك تصدير الطلبات المؤكدة بنقرة واحدة.",
    },
    {
      q: lang === "fr" ? "Est-ce que ça fonctionne pour les commandes COD ?" : "هل يعمل هذا مع الطلبات عند الدفع عند الاستلام؟",
      a: lang === "fr" ? "Absolument ! C'est même l'utilisation principale. La confirmation WhatsApp réduit considérablement les retours COD." : "بالتأكيد! هذا هو الاستخدام الرئيسي. تأكيد واتساب يقلل بشكل كبير من مرتجعات الدفع عند الاستلام.",
    },
    {
      q: lang === "fr" ? "Puis-je l'utiliser depuis mon téléphone ?" : "هل يمكنني استخدامه من هاتفي؟",
      a: lang === "fr" ? "Oui, notre plateforme est entièrement responsive et fonctionne parfaitement sur mobile et tablette." : "نعم، منصتنا متجاوبة بالكامل وتعمل بشكل ممتاز على الهاتف والجهاز اللوحي.",
    },
  ];

  return (
    <section id="faq" className="py-24 relative bg-muted/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">{t("faq.title")}</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "text-muted-foreground transition-transform duration-200 shrink-0",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === i ? "max-h-96 pb-5" : "max-h-0"
                )}
              >
                <p className="px-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
