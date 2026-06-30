"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTranslation } from "@/hooks/useTranslation";
import { Users } from "lucide-react";

export default function CustomersPage() {
  const { t, lang } = useTranslation();

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground text-sm">Gérez vos clients</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={18} /> Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">Section en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
