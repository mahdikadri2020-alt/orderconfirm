"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormEvent, useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export function Contact() {
  const { t, lang } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="contact" className="py-24 relative">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("contact.success")}</h3>
          <p className="text-muted-foreground">{lang === "fr" ? "Nous vous répondrons dans les plus brefs délais." : "سنتواصل معك في أقرب وقت ممكن."}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">{t("contact.title")}</h2>
            <p className="text-muted-foreground">{t("contact.subtitle")}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-whatsapp-100 dark:bg-whatsapp-900/30 flex items-center justify-center">
                  <MessageSquare size={20} className="text-whatsapp-600 dark:text-whatsapp-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{lang === "fr" ? "WhatsApp" : "واتساب"}</p>
                  <p className="text-sm text-muted-foreground">+213 XXX XX XX XX</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-2xl p-6">
            <Input id="name" label={t("contact.name")} placeholder={t("contact.name")} required />
            <Input id="phone" label={t("contact.phone")} placeholder={t("contact.phone")} type="tel" required />
            <Input id="store" label={t("contact.store")} placeholder={t("contact.store")} />
            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-sm font-medium">{t("contact.message")}</label>
              <textarea id="message" rows={4} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent transition-all duration-200" required />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Send size={16} />
              {t("contact.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
