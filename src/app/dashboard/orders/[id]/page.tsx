"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency, getStatusLabel } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, MessageCircle, CheckCircle2, XCircle, User, Package, Info, Monitor } from "lucide-react";
import Link from "next/link";
import type { Order, OrderActivity } from "@/types";
import { generateDemoOrders } from "../../demo-data";

export default function OrderDetailsPage() {
  const { t, lang } = useTranslation();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [activities, setActivities] = useState<OrderActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const demo = user?.email === "demo@orderconfirm.com";
      setIsDemo(demo);

      if (demo) {
        const demoOrders = generateDemoOrders(65);
        const found = demoOrders.find((o) => o.id === params.id);
        if (found) setOrder(found);
      } else {
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("id", params.id)
          .single();
        if (orderData) setOrder(orderData);

        const { data: activityData } = await supabase
          .from("order_activities")
          .select("*")
          .eq("order_id", params.id)
          .order("created_at", { ascending: true });
        if (activityData) setActivities(activityData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">{t("common.loading")}</div>;
  if (!order) return <div className="flex items-center justify-center h-64 text-muted-foreground">{t("common.noData")}</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={16} /> {t("orderDetails.back")}
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("orderDetails.title")} #{order.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground text-sm">{t("orderDetails.title")}</p>
          </div>
          {isDemo && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <Monitor size={14} /> Mode Démo
            </span>
          )}
        </div>
        <Badge variant={
          order.status === "confirmed" ? "success" :
          order.status === "cancelled" ? "danger" :
          order.status === "pending" ? "warning" : "info"
        }>
          {getStatusLabel(order.status, lang)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} /> {t("orderDetails.customerInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("orders.customerName")}</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("orders.phone")}</p>
                <p className="font-medium" dir="ltr">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("orders.wilaya")}</p>
                <p className="font-medium">{order.wilaya}</p>
              </div>
              {order.commune && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("orders.commune")}</p>
                  <p className="font-medium">{order.commune}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info size={18} /> {t("orderDetails.orderStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-whatsapp-500" />
              <span className="text-sm text-muted-foreground">{t("orders.status")}:</span>
              <Badge variant={
                order.status === "confirmed" ? "success" :
                order.status === "cancelled" ? "danger" :
                order.status === "pending" ? "warning" : "info"
              }>
                {getStatusLabel(order.status, lang)}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="gap-1 flex-1">
                <CheckCircle2 size={14} /> {t("orderDetails.markConfirmed")}
              </Button>
              <Button size="sm" variant="danger" className="gap-1 flex-1">
                <XCircle size={14} /> {t("orderDetails.markCancelled")}
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <MessageCircle size={16} /> {t("orderDetails.sendMessage")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={18} /> {t("orderDetails.productInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("orders.product")}</p>
              <p className="font-medium">{order.product}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("orders.price")}</p>
              <p className="font-medium text-lg">{formatCurrency(order.amount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("orderDetails.activityTimeline")}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline activities={activities} currentStatus={order.status} />
        </CardContent>
      </Card>
    </div>
  );
}
