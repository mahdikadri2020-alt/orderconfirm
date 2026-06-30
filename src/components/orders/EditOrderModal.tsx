"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { getWilayas } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: Order | null;
}

export function EditOrderModal({ isOpen, onClose, onSuccess, order }: EditOrderModalProps) {
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

  useEffect(() => {
    if (order) {
      setForm({
        customer_name: order.customer_name,
        customer_phone: order.phone,
        wilaya: order.wilaya,
        commune: order.commune || "",
        product_name: order.product,
        price_dzd: order.amount.toString(),
        notes: order.notes || "",
      });
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setLoading(true);
    setError(null);

    try {
      if (!form.customer_name.trim()) throw new Error("Le nom du client est requis");
      if (!form.customer_phone.trim()) throw new Error("Le téléphone est requis");
      if (!form.wilaya) throw new Error("La wilaya est requise");
      if (!form.product_name.trim()) throw new Error("Le produit est requis");
      if (!form.price_dzd || isNaN(parseFloat(form.price_dzd))) throw new Error("Le prix est requis");

      const { data, error: updateError } = await supabase
        .from("orders")
        .update({
          customer_name: form.customer_name.trim(),
          phone: form.customer_phone.trim(),
          wilaya: form.wilaya,
          commune: form.commune.trim(),
          product: form.product_name.trim(),
          amount: parseFloat(form.price_dzd),
          notes: form.notes.trim() || null,
        })
        .eq("id", order.id)
        .select();

      console.log("Updated data:", data);
      console.log("Update error:", updateError);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
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
    <Modal isOpen={isOpen} onClose={onClose} title={t("orders.editOrder")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Input id="ecustomer_name" name="customer_name" label={t("orders.customerName")} value={form.customer_name} onChange={handleChange} required />
        <Input id="ecustomer_phone" name="customer_phone" label={t("orders.phone")} value={form.customer_phone} onChange={handleChange} required type="tel" />
        <Select id="ewilaya" name="wilaya" label={t("orders.wilaya")} options={wilayaOptions} value={form.wilaya} onChange={handleChange} required />
        <Input id="ecommune" name="commune" label={t("orders.commune")} value={form.commune} onChange={handleChange} />
        <Input id="eproduct_name" name="product_name" label={t("orders.product")} value={form.product_name} onChange={handleChange} required />
        <Input id="eprice_dzd" name="price_dzd" label={`${t("orders.price")} (DA)`} value={form.price_dzd} onChange={handleChange} required type="number" step="0.01" />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">{t("orders.cancel")}</Button>
          <Button type="submit" loading={loading} className="flex-1">{t("orders.save")}</Button>
        </div>
      </form>
    </Modal>
  );
}
