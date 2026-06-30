"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { Save, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const { t, lang } = useTranslation();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {lang === "fr" ? "Paramètres de la plateforme" : "إعدادات المنصة"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} /> {t("settings.security")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" size="sm">{t("settings.changePassword")}</Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full gap-2">
        <Save size={16} /> {t("settings.save")}
      </Button>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium">
          {t("settings.saved")}
        </div>
      )}
    </div>
  );
}
