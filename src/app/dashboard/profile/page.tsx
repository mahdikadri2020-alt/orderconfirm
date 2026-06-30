"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTranslation } from "@/hooks/useTranslation";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { t, lang } = useTranslation();

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="text-muted-foreground text-sm">Gérez votre profil</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={18} /> Profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">Section en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
