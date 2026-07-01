"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { getWilayas } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddOrderModal({ isOpen, onClose, onSuccess }: AddOrderModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    wilaya: "",
    commune: "",
    product_name: "",
    price_dzd: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission while request is in flight
    if (loading) return;

    setError(null);
    setSuccessMessage(null);
    setWarningMessage(null);
    setLoading(true);

    try {
      if (!form.customer_name.trim()) throw new Error("Le nom du client est requis");
      if (!form.customer_phone.trim()) throw new Error("Le téléphone est requis");
      if (!form.wilaya) throw new Error("La wilaya est requise");
      if (!form.product_name.trim()) throw new Error("Le produit est requis");
      if (!form.price_dzd || isNaN(parseFloat(form.price_dzd))) throw new Error("Le prix est requis");

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Vous devez être connecté pour créer une commande");

      const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id, store_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (storeError) throw storeError;
      if (!store) throw new Error("Aucun magasin trouvé. Veuillez contacter l'administration.");

      const payload = {
        store_id: store.id,
        customer_name: form.customer_name.trim(),
        phone: form.customer_phone.trim(),
        wilaya: form.wilaya,
        commune: form.commune.trim(),
        product: form.product_name.trim(),
        amount: parseFloat(form.price_dzd),
        notes: form.notes.trim() || null,
        status: "pending",
      };

      const { data, error: insertError } = await supabase
        .from("orders")
        .insert([payload])
        .select();

      if (insertError) throw insertError;

      // ===== N8N WEBHOOK START =====
      // Fires once AFTER the order is persisted in Supabase.
      // Sends the full order + store context to n8n for WhatsApp/notification flow.
      // If the webhook is unreachable the order is still saved; a warning is shown.
      let webhookFailed = false;
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

      if (webhookUrl) {
        try {
          const webhookPayload = {
            order_id: data?.[0]?.id,
            store_id: payload.store_id,
            customer_name: payload.customer_name,
            phone: payload.phone,
            product: payload.product,
            quantity: 1,
            wilaya: payload.wilaya,
            commune: payload.commune,
            delivery_type: "standard",
            amount: payload.amount,
            currency: "DA",
            language: "fr",
            store_name: store.store_name || "",
          };

          const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(webhookPayload),
          });

          if (!res.ok) {
            console.warn("n8n webhook responded with status:", res.status);
            webhookFailed = true;
          }
        } catch (webhookErr) {
          console.error("n8n webhook request failed:", webhookErr);
          webhookFailed = true;
        }
      }

      if (webhookFailed) {
        setWarningMessage("Votre commande a été enregistrée, mais le service de confirmation est temporairement indisponible.");
      } else {
        setSuccessMessage("Commande créée avec succès !");
      }
      // ===== N8N WEBHOOK END =====

      setLoading(false);

      // Auto-close after the user has had time to read the message
      setTimeout(() => {
        onSuccess();
        onClose();
        setForm({ customer_name: "", customer_phone: "", wilaya: "", commune: "", product_name: "", price_dzd: "", notes: "" });
      }, webhookFailed ? 4000 : 2000);
    } catch (err) {
      setLoading(false);
      console.error(err);
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      alert(message);
      setError(message);
    }
  };

  const wilayaOptions = getWilayas().map((w) => ({ value: w, label: w }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("orders.addOrder")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        {warningMessage && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {warningMessage}
          </div>
        )}
        <Input id="customer_name" name="customer_name" label={t("orders.customerName")} value={form.customer_name} onChange={handleChange} required disabled={loading} />
        <Input id="customer_phone" name="customer_phone" label={t("orders.phone")} value={form.customer_phone} onChange={handleChange} required type="tel" disabled={loading} />
        <Select id="wilaya" name="wilaya" label={t("orders.wilaya")} options={wilayaOptions} placeholder={t("requestAccount.selectWilaya")} value={form.wilaya} onChange={handleChange} required disabled={loading} />
        <Input id="commune" name="commune" label={t("orders.commune")} value={form.commune} onChange={handleChange} disabled={loading} />
        <Input id="product_name" name="product_name" label={t("orders.product")} value={form.product_name} onChange={handleChange} required disabled={loading} />
        <Input id="price_dzd" name="price_dzd" label={`${t("orders.price")} (DA)`} value={form.price_dzd} onChange={handleChange} required type="number" step="0.01" disabled={loading} />
        <div className="space-y-1.5">
          <label htmlFor="notes" className="block text-sm font-medium">{t("orders.notes")}</label>
          <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5" disabled={loading} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>{t("orders.cancel")}</Button>
          <Button type="submit" loading={loading} className="flex-1">{t("orders.save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
