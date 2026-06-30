"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { EditOrderModal } from "@/components/orders/EditOrderModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types";

export default function OrdersPage() {
  const { t, lang } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("orders.confirmDelete"))) return;
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      await loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (order: Order) => {
    setEditOrder(order);
    setEditOpen(true);
  };

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold">{t("orders.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {lang === "fr" ? "Gérez toutes vos commandes" : "إدارة جميع طلباتك"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("orders.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={orders}
            loading={loading}
            onAdd={() => setAddOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <AddOrderModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSuccess={loadOrders} />
      <EditOrderModal isOpen={editOpen} onClose={() => { setEditOpen(false); setEditOrder(null); }} onSuccess={loadOrders} order={editOrder} />
    </div>
  );
}

