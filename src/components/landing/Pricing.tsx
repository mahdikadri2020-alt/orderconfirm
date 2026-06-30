"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  const { t, lang } = useTranslation();

  const plans = [
    {
      name: t("pricing.starter.name"),
      price: t("pricing.starter.price"),
      orders: t("pricing.starter.orders"),
      features: t("pricing.starter.features").split(", "),
      popular: false,
    },
    {
      name: t("pricing.professional.name"),
      price: t("pricing.professional.price"),
      orders: t("pricing.professional.orders"),
      features: t("pricing.professional.features").split(", "),
      popular: true,
    },
    {
      name: t("pricing.enterprise.name"),
      price: t("pricing.enterprise.price"),
      orders: t("pricing.enterprise.orders"),
      features: t("pricing.enterprise.features").split(", "),
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">{t("pricing.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("pricing.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-whatsapp-500 bg-gradient-to-b from-whatsapp-50/50 to-transparent dark:from-whatsapp-900/10 shadow-lg shadow-whatsapp-500/10 scale-105"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-whatsapp-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {t("pricing.popular")}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{lang === "fr" ? "DA/mois" : "دج/شهر"}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.orders}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature: string, j: number) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <Check size={16} className="text-whatsapp-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/demande-compte">
                <Button className={`w-full ${plan.popular ? "" : "variant-outline"}`}>
                  {t("pricing.cta")}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
