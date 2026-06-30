"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Check, X, Eye } from "lucide-react";

export default function AdminDemandesPage() {
  const { t, lang } = useTranslation();
  const [requests, setRequests] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data } = await supabase
        .from("account_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await supabase.from("account_requests").update({ status }).eq("id", id);
      loadRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold">{t("admin.accountRequests")}</h1>
        <p className="text-muted-foreground text-sm">
          {lang === "fr" ? "Gérez les demandes de compte" : "إدارة طلبات الحساب"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.accountRequests")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 font-medium">{t("requestAccount.name")}</th>
                  <th className="text-left pb-3 font-medium">{t("requestAccount.phone")}</th>
                  <th className="text-left pb-3 font-medium">{t("requestAccount.store")}</th>
                  <th className="text-left pb-3 font-medium">{t("requestAccount.wilaya")}</th>
                  <th className="text-left pb-3 font-medium">{t("requestAccount.monthlyOrders")}</th>
                  <th className="text-left pb-3 font-medium">{t("orders.status")}</th>
                  <th className="text-left pb-3 font-medium">{t("orders.date")}</th>
                  <th className="text-left pb-3 font-medium">{t("orders.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">{t("common.loading")}</td></tr>
                ) : requests.length === 0 ? (
                  <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">{t("admin.noRequests")}</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 font-medium">{req.full_name}</td>
                      <td className="py-3" dir="ltr">{req.whatsapp}</td>
                      <td className="py-3">{req.store_name}</td>
                      <td className="py-3">{req.wilaya}</td>
                      <td className="py-3">{req.monthly_orders}</td>
                      <td className="py-3">
                        <Badge variant={req.status === "approved" ? "success" : req.status === "rejected" ? "danger" : "warning"}>
                          {req.status === "approved" ? t("admin.approved") : req.status === "rejected" ? t("admin.rejected") : t("admin.pending")}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">{formatDate(req.created_at)}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          {req.status === "pending" && (
                            <>
                              <button onClick={() => updateStatus(req.id, "approved")} className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 rounded-lg" title={t("admin.approve")}>
                                <Check size={15} />
                              </button>
                              <button onClick={() => updateStatus(req.id, "rejected")} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg" title={t("admin.reject")}>
                                <X size={15} />
                              </button>
                            </>
                          )}
                          <button className="p-1.5 hover:bg-muted rounded-lg" title={t("admin.viewDetails")}>
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

