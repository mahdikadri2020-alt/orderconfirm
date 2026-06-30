"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useDemo } from "@/hooks/useDemo";
import { getWilayas } from "@/lib/utils";
import { Save, MessageSquare, Users, Shield, Globe, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { t, lang } = useTranslation();
  const { isDemo, showDemoToast } = useDemo();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    store_name: "",
    wilaya: "",
    language: "fr",
    whatsapp_number: "+213",
    api_key: "",
    webhook_url: "",
    test_mode: "off",
  });

  const handleSave = () => {
    if (isDemo) {
      showDemoToast();
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const wilayaOptions = getWilayas().map((w) => ({ value: w, label: w }));
  const langOptions = [
    { value: "fr", label: t("settings.fr") },
    { value: "ar", label: t("settings.ar") },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {lang === "fr" ? "Gérez vos paramètres" : "إدارة إعداداتك"}
          </p>
        </div>
        {isDemo && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
            <Monitor size={14} /> Mode Démo
          </span>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={18} /> {t("settings.general")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="store_name" label={t("settings.storeName")} value={settings.store_name} onChange={(e) => setSettings({ ...settings, store_name: e.target.value })} />
            <Select id="wilaya" label={t("settings.wilaya")} options={wilayaOptions} value={settings.wilaya} onChange={(e) => setSettings({ ...settings, wilaya: e.target.value })} />
            <Select id="language" label={t("settings.language")} options={langOptions} value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={18} /> {t("settings.whatsapp")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="whatsapp_number" label={t("settings.whatsappNumber")} value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} type="tel" />
            <Input id="api_key" label={t("settings.apiKey")} value={settings.api_key} onChange={(e) => setSettings({ ...settings, api_key: e.target.value })} type="password" />
            <Input id="webhook_url" label={t("settings.webhookUrl")} value={settings.webhook_url} onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })} />
            <div className="space-y-1.5">
              <label htmlFor="test_mode" className="block text-sm font-medium">{t("settings.testMode")}</label>
              <select id="test_mode" value={settings.test_mode} onChange={(e) => setSettings({ ...settings, test_mode: e.target.value })}>
                <option value="off">{lang === "fr" ? "Désactivé" : "معطل"}</option>
                <option value="on">{lang === "fr" ? "Activé" : "مفعل"}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={18} /> {t("settings.templates")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">{t("settings.confirmationMsg")}</label>
              <textarea rows={4} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5" defaultValue={lang === "fr" ? "Bonjour {customer}, confirmez-vous votre commande #{order_id} ?\n1 - Confirmer\n2 - Annuler" : "السلام عليكم {customer}، هل تؤكد طلبك رقم #{order_id}؟\n1 - تأكيد\n2 - إلغاء"} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">{t("settings.cancellationMsg")}</label>
              <textarea rows={3} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5" defaultValue={lang === "fr" ? "Votre commande #{order_id} a été annulée." : "تم إلغاء طلبك رقم #{order_id}."} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">{t("settings.reminderMsg")}</label>
              <textarea rows={3} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5" defaultValue={lang === "fr" ? "Rappel: Confirmez votre commande #{order_id} pour éviter l'annulation." : "تذكير: قم بتأكيد طلبك #{order_id} لتجنب الإلغاء."} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">{t("settings.followUpMsg")}</label>
              <textarea rows={3} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5" defaultValue={lang === "fr" ? "Merci d'avoir confirmé votre commande #{order_id} !" : "شكراً لتأكيد طلبك #{order_id}!"} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={18} /> {t("settings.users")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm">{t("settings.addUser")}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} /> {t("settings.security")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" size="sm">{t("settings.changePassword")}</Button>
          <Button variant="outline" size="sm">{t("settings.twoFactor")}</Button>
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
