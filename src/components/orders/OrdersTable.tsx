"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency, formatDate, getStatusLabel, getWilayas } from "@/lib/utils";
import { Search, Plus, Trash2, Edit3, Eye, Download, Check, X, Monitor } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

export function OrdersTable({ orders, loading, onAdd, onEdit, onDelete }: OrdersTableProps) {
  const isDemo = orders.length > 0 && orders[0].id.startsWith("demo-");
  const { t, lang } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = orders.filter((o) => {
    if (search && !o.customer_name.toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
    if (statusFilter && o.status !== statusFilter) return false;
    if (wilayaFilter && o.wilaya !== wilayaFilter) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((o) => o.id));
  };

  const statusOptions = [
    { value: "pending", label: getStatusLabel("pending", lang) },
    { value: "confirmed", label: getStatusLabel("confirmed", lang) },
    { value: "cancelled", label: getStatusLabel("cancelled", lang) },
    { value: "no_response", label: getStatusLabel("no_response", lang) },
  ];

  const wilayaOptions = getWilayas().map((w) => ({ value: w, label: w }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder={t("orders.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          >
            <option value="">{t("orders.allStatuses")}</option>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={wilayaFilter}
            onChange={(e) => setWilayaFilter(e.target.value)}
            className="w-44"
          >
            <option value="">{t("orders.allWilayas")}</option>
            {wilayaOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <>
              <Button size="sm" variant="secondary" className="gap-1">
                <Check size={14} /> {t("orders.bulkConfirm")}
              </Button>
              <Button size="sm" variant="danger" className="gap-1">
                <X size={14} /> {t("orders.bulkCancel")}
              </Button>
              <Button size="sm" variant="secondary" className="gap-1">
                <Download size={14} /> {t("orders.export")}
              </Button>
            </>
          )}
          {isDemo ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <Monitor size={14} /> Mode Démo
            </span>
          ) : (
            <Button size="sm" className="gap-1" onClick={onAdd}>
              <Plus size={16} /> {t("orders.addOrder")}
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-border" />
              </th>
              <th className="p-3 text-left font-medium">{t("orders.orderId")}</th>
              <th className="p-3 text-left font-medium">{t("orders.customerName")}</th>
              <th className="p-3 text-left font-medium">{t("orders.phone")}</th>
              <th className="p-3 text-left font-medium">{t("orders.product")}</th>
              <th className="p-3 text-left font-medium">{t("orders.price")}</th>
              <th className="p-3 text-left font-medium">{t("orders.wilaya")}</th>
              <th className="p-3 text-left font-medium">{t("orders.status")}</th>
              <th className="p-3 text-left font-medium">{t("orders.date")}</th>
              <th className="p-3 text-left font-medium">{t("orders.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-muted-foreground">{t("common.loading")}</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-muted-foreground">{t("orders.noOrders")}</td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.includes(order.id)} onChange={() => toggleSelect(order.id)} className="rounded border-border" />
                  </td>
                  <td className="p-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                  <td className="p-3 font-medium">{order.customer_name}</td>
                  <td className="p-3">{order.phone}</td>
                  <td className="p-3">{order.product}</td>
                  <td className="p-3 font-medium">{formatCurrency(order.amount)}</td>
                  <td className="p-3">{order.wilaya}</td>
                  <td className="p-3">
                    <Badge variant={
                      order.status === "confirmed" ? "success" :
                      order.status === "cancelled" ? "danger" :
                      order.status === "pending" ? "warning" : "info"
                    }>
                      {getStatusLabel(order.status, lang)}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{formatDate(order.created_at)}</td>
                    <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title={t("common.view")}>
                          <Eye size={15} />
                        </button>
                      </Link>
                      <button onClick={() => onEdit(order)} className={isDemo ? "p-1.5 rounded-lg text-muted-foreground/30 cursor-not-allowed" : "p-1.5 hover:bg-muted rounded-lg transition-colors"} title={isDemo ? "Désactivé en mode Démo" : t("common.edit")}>
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => onDelete(order.id)} className={isDemo ? "p-1.5 rounded-lg text-muted-foreground/30 cursor-not-allowed" : "p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"} title={isDemo ? "Désactivé en mode Démo" : t("common.delete")}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
