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
    console.log("STEP 1: Submit clicked");

    setLoading(true);
    setError(null);

    try {
      console.log("STEP 2: Validation");
      if (!form.customer_name.trim()) throw new Error("Le nom du client est requis");
      if (!form.customer_phone.trim()) throw new Error("Le téléphone est requis");
      if (!form.wilaya) throw new Error("La wilaya est requise");
      if (!form.product_name.trim()) throw new Error("Le produit est requis");
      if (!form.price_dzd || isNaN(parseFloat(form.price_dzd))) throw new Error("Le prix est requis");

      console.log("STEP 2b: Getting current user");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log("Current user:", user?.id, user?.email);
      if (userError) throw userError;
      if (!user) throw new Error("Vous devez être connecté pour créer une commande");

      console.log("STEP 2c: Looking up store");
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      console.log("Store lookup result:", store, "Error:", storeError);
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

      console.log("STEP 3: Payload", payload);

      console.log("STEP 4: Sending request...");
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert([payload])
        .select();

      console.log("STEP 5: Inserted data:", data);
      console.log("STEP 5: Supabase error:", insertError);

      if (insertError) throw insertError;

      console.log("STEP 6: Success");

      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }).catch(() => {});
      }

      onSuccess();
      onClose();
      setForm({ customer_name: "", customer_phone: "", wilaya: "", commune: "", product_name: "", price_dzd: "", notes: "" });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      alert(message);
      setError(message);
    } finally {
      setLoading(false);
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
        <Input id="customer_name" name="customer_name" label={t("orders.customerName")} value={form.customer_name} onChange={handleChange} required />
        <Input id="customer_phone" name="customer_phone" label={t("orders.phone")} value={form.customer_phone} onChange={handleChange} required type="tel" />
        <Select id="wilaya" name="wilaya" label={t("orders.wilaya")} options={wilayaOptions} placeholder={t("requestAccount.selectWilaya")} value={form.wilaya} onChange={handleChange} required />
        <Input id="commune" name="commune" label={t("orders.commune")} value={form.commune} onChange={handleChange} />
        <Input id="product_name" name="product_name" label={t("orders.product")} value={form.product_name} onChange={handleChange} required />
        <Input id="price_dzd" name="price_dzd" label={`${t("orders.price")} (DA)`} value={form.price_dzd} onChange={handleChange} required type="number" step="0.01" />
        <div className="space-y-1.5">
          <label htmlFor="notes" className="block text-sm font-medium">{t("orders.notes")}</label>
          <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">{t("orders.cancel")}</Button>
          <Button type="submit" loading={loading} className="flex-1">{t("orders.save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
