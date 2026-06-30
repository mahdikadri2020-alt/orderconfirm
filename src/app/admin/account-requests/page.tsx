"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Check, X, RefreshCw, Users, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface AccountRequest {
  id: string;
  full_name: string;
  whatsapp: string;
  store_name: string;
  wilaya: string;
  monthly_orders: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function AdminAccountRequestsPage() {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("account_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id: string) => {
    setUpdating(id);
    setNotification(null);
    try {
      const res = await fetch("/api/admin/approve-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'approbation.");
      setNotification({ type: "success", message: "Compte client créé avec succès." });
      loadRequests();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue.";
      setNotification({ type: "error", message: msg });
    } finally {
      setUpdating(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const rejectRequest = async (id: string) => {
    setUpdating(id);
    setNotification(null);
    try {
      const { error } = await supabase
        .from("account_requests")
        .update({ status: "rejected" })
        .eq("id", id);
      if (error) throw error;
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const badge = (status: string) => {
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "approved":
        return `${base} bg-emerald-100 text-emerald-700`;
      case "rejected":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-amber-100 text-amber-700`;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Rejeté";
      default:
        return "En attente";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Demandes de comptes</h1>
          <p className="text-muted-foreground text-sm">
            Gérez les demandes d&apos;inscription des commerçants
          </p>
        </div>
        <button
          onClick={loadRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {notification && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium animate-slide-down ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users size={18} />
            Demandes reçues
            {requests.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({requests.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <RefreshCw size={20} className="animate-spin mr-2" />
              Chargement...
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <AlertCircle size={32} className="mb-3 opacity-50" />
              <p className="text-sm">Aucune demande de compte trouvée.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Nom complet
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Magasin
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Wilaya
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Commandes/mois
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-medium">{req.full_name}</td>
                      <td className="p-4 font-mono text-xs" dir="ltr">
                        {req.whatsapp}
                      </td>
                      <td className="p-4">{req.store_name}</td>
                      <td className="p-4">{req.wilaya}</td>
                      <td className="p-4">{req.monthly_orders}</td>
                      <td className="p-4">
                        <span className={badge(req.status)}>
                          {statusLabel(req.status)}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(req.created_at)}
                      </td>
                      <td className="p-4">
                        {req.status === "pending" ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => approveRequest(req.id)}
                              disabled={updating === req.id}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                              title="Approuver"
                            >
                              {updating === req.id ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              ) : (
                                <Check size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => rejectRequest(req.id)}
                              disabled={updating === req.id}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 transition-colors"
                              title="Rejeter"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {req.status === "approved" ? "Approuvé" : "Rejeté"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
