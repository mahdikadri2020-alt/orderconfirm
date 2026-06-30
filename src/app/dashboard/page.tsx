"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { WilayaChart } from "@/components/dashboard/WilayaChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp, Truck, Plus, BarChart3, Monitor } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types";
import { generateDemoOrders, computeDemoStats } from "./demo-data";

export default function CustomerDashboard() {
  const { t, lang } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email === "demo@orderconfirm.com") {
        setIsDemo(true);
        const demoOrders = generateDemoOrders(65);
        setOrders(demoOrders);
      } else {
        loadOrders();
      }
    });
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = isDemo ? computeDemoStats(orders) : null;
  const total = stats ? stats.total : orders.length;
  const confirmed = stats ? stats.confirmed : orders.filter((o) => o.status === "confirmed").length;
  const cancelled = stats ? stats.cancelled : orders.filter((o) => o.status === "cancelled").length;
  const noResponse = stats ? stats.noResponse : orders.filter((o) => o.status === "no_response").length;
  const pending = stats ? stats.pending : orders.filter((o) => o.status === "pending").length;
  const confirmationRate = stats ? stats.confirmationRate : (total > 0 ? Math.round((confirmed / total) * 100) : 0);
  const revenue = stats ? stats.revenue : orders.filter((o) => o.status === "confirmed").reduce((sum, o) => sum + o.amount, 0);
  const deliverySavings = Math.round(revenue * 0.15);

  const recentOrders = orders.slice(0, 5);

  const pieData = [
    { name: getStatusLabel("confirmed", lang), value: confirmed, color: "#25D366" },
    { name: getStatusLabel("cancelled", lang), value: cancelled, color: "#ef4444" },
    { name: getStatusLabel("pending", lang), value: pending, color: "#f59e0b" },
    { name: getStatusLabel("no_response", lang), value: noResponse, color: "#6b7280" },
  ].filter((d) => d.value > 0);

  const ordersByDay = orders.reduce((acc: Record<string, number>, o) => {
    const day = new Date(o.created_at).toLocaleDateString("fr-DZ", { weekday: "short" });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const trendData = Object.entries(ordersByDay).map(([name, value]) => ({ name, value: value as number }));

  const wilayaData = orders.reduce((acc: Record<string, any>, o) => {
    if (!acc[o.wilaya]) acc[o.wilaya] = { name: o.wilaya, confirmed: 0, cancelled: 0 };
    if (o.status === "confirmed") acc[o.wilaya].confirmed++;
    if (o.status === "cancelled") acc[o.wilaya].cancelled++;
    return acc;
  }, {});
  const wilayaChartData = Object.values(wilayaData).slice(0, 10) as any[];

  return (
    <div className="space-y-8" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
            <p className="text-muted-foreground text-sm">
              {lang === "fr" ? "Bienvenue sur votre tableau de bord" : "مرحباً بك في لوحة التحكم"}
            </p>
          </div>
          {isDemo && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <Monitor size={14} /> Mode Démo
            </span>
          )}
        </div>
        <Link href="/dashboard/orders">
          <Button className="gap-2">
            <Plus size={16} /> {t("dashboard.addOrder")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t("dashboard.totalOrders")} value={total.toString()} icon={ShoppingBag} color="blue" />
        <StatCard title={t("dashboard.confirmedOrders")} value={confirmed.toString()} icon={CheckCircle2} color="green" trend={confirmationRate} />
        <StatCard title={t("dashboard.cancelledOrders")} value={cancelled.toString()} icon={XCircle} color="red" />
        <StatCard title={t("dashboard.noResponse")} value={noResponse.toString()} icon={Clock} color="amber" />
        <StatCard title={t("dashboard.pendingOrders")} value={pending.toString()} icon={AlertTriangle} color="purple" />
        <StatCard title={t("dashboard.confirmationRate")} value={`${confirmationRate}%`} icon={TrendingUp} color="green" />
        <StatCard title={t("dashboard.revenue")} value={formatCurrency(revenue)} icon={BarChart3} color="blue" />
        <StatCard title={t("dashboard.deliverySavings")} value={formatCurrency(deliverySavings)} icon={Truck} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.statusDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? <OrderStatusChart data={pieData} /> : <p className="text-muted-foreground text-sm text-center py-8">{t("common.noData")}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.ordersByDay")}</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? <TrendChart data={trendData} /> : <p className="text-muted-foreground text-sm text-center py-8">{t("common.noData")}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.wilayaPerformance")}</CardTitle>
        </CardHeader>
        <CardContent>
          {wilayaChartData.length > 0 ? <WilayaChart data={wilayaChartData} /> : <p className="text-muted-foreground text-sm text-center py-8">{t("common.noData")}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("dashboard.recentOrders")}</CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm">
              {lang === "fr" ? "Voir tout" : "عرض الكل"}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 font-medium">{t("orders.customerName")}</th>
                  <th className="text-left pb-3 font-medium">{t("orders.product")}</th>
                  <th className="text-left pb-3 font-medium">{t("orders.price")}</th>
                  <th className="text-left pb-3 font-medium">{t("orders.status")}</th>
                  <th className="text-left pb-3 font-medium">{t("orders.date")}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">{t("common.noData")}</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3">{order.customer_name}</td>
                      <td className="py-3">{order.product}</td>
                      <td className="py-3 font-medium">{formatCurrency(order.amount)}</td>
                      <td className="py-3">
                        <Badge variant={order.status === "confirmed" ? "success" : order.status === "cancelled" ? "danger" : order.status === "pending" ? "warning" : "info"}>
                          {getStatusLabel(order.status, lang)}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">{formatDate(order.created_at)}</td>
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
