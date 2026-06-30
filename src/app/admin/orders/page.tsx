"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { ShoppingBag } from "lucide-react";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const { t, lang } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold">{t("orders.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {lang === "fr" ? "Toutes les commandes de la plateforme" : "جميع طلبات المنصة"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag size={18} /> {t("orders.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.customerName")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.phone")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.product")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.price")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.wilaya")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.status")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.date")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">{t("common.loading")}</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">{t("common.noData")}</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{order.customer_name}</td>
                      <td className="p-4 font-mono text-xs" dir="ltr">{order.phone}</td>
                      <td className="p-4">{order.product}</td>
                      <td className="p-4 font-medium">{formatCurrency(order.amount)}</td>
                      <td className="p-4">{order.wilaya}</td>
                      <td className="p-4">
                        <Badge variant={order.status === "confirmed" ? "success" : order.status === "cancelled" ? "danger" : order.status === "pending" ? "warning" : "info"}>
                          {getStatusLabel(order.status, lang)}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs whitespace-nowrap">{formatDate(order.created_at)}</td>
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
