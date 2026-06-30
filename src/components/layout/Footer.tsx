"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { lang } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-whatsapp-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">OC</span>
              </div>
              <span className="font-bold text-lg">
                Order<span className="text-whatsapp-500">Confirm</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              {lang === "fr" ? "Une plateforme intelligente qui aide les e-commerçants algériens à confirmer les commandes avant expédition." : "منصة ذكية تساعد التجار الجزائريين على تأكيد الطلبات قبل الشحن."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{lang === "fr" ? "Fonctionnalités" : "المميزات"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{lang === "fr" ? "Confirmation WhatsApp" : "تأكيد عبر واتساب"}</li>
              <li>{lang === "fr" ? "Tableau de bord" : "لوحة التحكم"}</li>
              <li>{lang === "fr" ? "Export livreurs" : "تصدير لشركات التوصيل"}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{lang === "fr" ? "Contact" : "اتصل بنا"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contact@orderconfirm.dz</li>
              <li>{lang === "fr" ? "Tél" : "الهاتف"}: +213 XXX XX XX XX</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          &copy; {year} OrderConfirm DZ. {lang === "fr" ? "Tous droits réservés." : "جميع الحقوق محفوظة."}
        </div>
      </div>
    </footer>
  );
}
