"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useTranslation } from "@/hooks/useTranslation";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Store, ShoppingBag, CheckCircle2, Users, UserPlus, Trash2, Eye } from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
  store_name: string;
  whatsapp: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { t, lang } = useTranslation();
  const [stats, setStats] = useState({
    merchants: 0,
    orders: 0,
    confirmed: 0,
    cancelled: 0,
    pending: 0,
    requests: 0,
  });
  const [leads, setLeads] = useState<Record<string, any>[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadData();
    loadCustomers();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const approveRequest = async (id: string | number) => {
    try {
      const response = await fetch("/api/admin/approve-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: id }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error);
        return;
      }
      showToast("success", "Compte client créé avec succès.");
      loadData();
      loadCustomers();
    } catch (err) {
      showToast("error", "Une erreur est survenue lors de l'approbation.");
    }
  };

  const loadData = async () => {
    try {
      const { count: merchants } = await supabase.from("stores").select("*", { count: "exact", head: true });
      const { count: orders } = await supabase.from("orders").select("*", { count: "exact", head: true });
      const { count: confirmed } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "confirmed");
      const { count: cancelled } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "cancelled");
      const { count: pending } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending");
      const { count: requests } = await supabase.from("account_requests").select("*", { count: "exact", head: true });

      setStats({
        merchants: merchants || 0,
        orders: orders || 0,
        confirmed: confirmed || 0,
        cancelled: cancelled || 0,
        pending: pending || 0,
        requests: requests || 0,
      });

      const { data: leadData } = await supabase
        .from("account_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (leadData) setLeads(leadData);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCustomers = async () => {
    setCustomersLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("role", "admin")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCustomersLoading(false);
    }
  };

  const openDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/delete-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: selectedCustomer.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression.");
      showToast("success", t("admin.deleteSuccess"));
      setDeleteModal(false);
      setSelectedCustomer(null);
      loadCustomers();
      loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("admin.deleteError");
      showToast("error", msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8" dir={lang === "ar" ? "rtl" : "ltr"}>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-down ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">Administration</h1>
        <p className="text-muted-foreground text-sm">Gérez la plateforme</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t("admin.totalMerchants")} value={stats.merchants.toString()} icon={Store} color="blue" />
        <StatCard title={t("admin.totalOrders")} value={stats.orders.toString()} icon={ShoppingBag} color="purple" />
        <StatCard title={t("admin.accountRequests")} value={stats.requests.toString()} icon={Users} color="amber" />
        <StatCard title="Confirmées" value={stats.confirmed.toString()} icon={CheckCircle2} color="green" trend={stats.orders > 0 ? Math.round((stats.confirmed / stats.orders) * 100) : 0} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("admin.accountRequests")}</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="gap-1">
              <UserPlus size={14} /> {t("admin.createMerchant")}
            </Button>
          </div>
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
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">{t("admin.noRequests")}</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 font-medium">{lead.full_name}</td>
                      <td className="py-3" dir="ltr">{lead.whatsapp}</td>
                      <td className="py-3">{lead.store_name}</td>
                      <td className="py-3">{lead.wilaya}</td>
                      <td className="py-3">{lead.monthly_orders}</td>
                      <td className="py-3">
                        <Badge variant={lead.status === "approved" ? "success" : lead.status === "rejected" ? "danger" : "warning"}>
                          {lead.status === "approved" ? t("admin.approved") : lead.status === "rejected" ? t("admin.rejected") : t("admin.pending")}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">{formatDate(lead.created_at)}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          {lead.status === "pending" && (
                            <>
                              <Button size="sm" variant="primary" className="text-xs px-3 py-1 h-auto" onClick={() => approveRequest(lead.id)}>{t("admin.approve")}</Button>
                              <Button size="sm" variant="danger" className="text-xs px-3 py-1 h-auto">{t("admin.reject")}</Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" className="text-xs px-3 py-1 h-auto">{t("admin.viewDetails")}</Button>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={18} /> {t("admin.customers")}
            {customers.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">({customers.length})</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {customersLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("common.loading")}
            </div>
          ) : customers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">{t("admin.noCustomers")}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("admin.customerName")}</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("admin.customerStore")}</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("admin.customerWhatsapp")}</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("admin.customerStatus")}</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.date")}</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("orders.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{customer.full_name}</td>
                      <td className="p-4">{customer.store_name}</td>
                      <td className="p-4 font-mono text-xs" dir="ltr">{customer.whatsapp || "—"}</td>
                      <td className="p-4">
                        <Badge variant={customer.role === "merchant" ? "success" : "info"}>
                          {customer.role === "merchant" ? t("admin.active") : t("admin.inactive")}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs whitespace-nowrap">{formatDate(customer.created_at)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title={t("admin.viewDetails")}>
                            <Eye size={16} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(customer)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={t("admin.deleteCustomer")}
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={deleteModal} onClose={() => !deleting && setDeleteModal(false)} title={t("admin.deleteCustomer")}>
        {selectedCustomer && (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="font-medium">{selectedCustomer.full_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.store_name}</p>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                {t("admin.deleteWarning")}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDeleteModal(false)}
                disabled={deleting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={deleting}
                onClick={handleDeleteCustomer}
              >
                {t("common.delete")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
