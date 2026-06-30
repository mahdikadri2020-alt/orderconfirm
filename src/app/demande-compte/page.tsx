"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { getWilayas, getMonthlyOrderOptions } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function RequestAccountPage() {
  const { t, lang } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    whatsapp: "",
    store_name: "",
    wilaya: "",
    monthly_orders: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.full_name || !form.whatsapp || !form.store_name || !form.wilaya || !form.monthly_orders) {
        setError("Veuillez remplir tous les champs.");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const { data, error } = await supabase
      .from("account_requests")
      .insert([
        {
          full_name: form.full_name,
          whatsapp: form.whatsapp,
          store_name: form.store_name,
          wilaya: form.wilaya,
          monthly_orders: form.monthly_orders,
          email: form.email,
          password: form.password,
          status: "pending",
        },
      ])
      .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) throw error;

    setSubmitted(true);
  } catch (err: any) {
    console.error(err);
    setError(err.message || "Unknown error");
  } finally {
    setLoading(false);
  }
 };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Demande envoyée avec succès !</h2>
            <p className="text-muted-foreground">
              Votre demande a été reçue. Nous vous contacterons dans les plus brefs délais.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const wilayaOptions = getWilayas().map((w) => ({ value: w, label: w }));
  const orderOptions = getMonthlyOrderOptions(lang);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto px-4">
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-3xl font-bold">Demander un compte</h1>
            <p className="text-muted-foreground">
              Créez votre compte professionnel en quelques étapes.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-whatsapp-500 text-white" : "bg-muted text-muted-foreground"}`}>1</div>
            <div className={`w-20 h-0.5 ${step >= 2 ? "bg-whatsapp-500" : "bg-border"}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-whatsapp-500 text-white" : "bg-muted text-muted-foreground"}`}>2</div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5 shadow-sm">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <Input id="full_name" name="full_name" label="Nom complet" value={form.full_name} onChange={handleChange} required placeholder="Votre nom" />
                <Input id="whatsapp" name="whatsapp" label="Numéro WhatsApp" value={form.whatsapp} onChange={handleChange} required type="tel" placeholder="+213 XXX XX XX XX" />
                <Input id="store_name" name="store_name" label="Nom du magasin" value={form.store_name} onChange={handleChange} required placeholder="Nom de votre boutique" />
                <Select id="wilaya" name="wilaya" label="Wilaya" options={wilayaOptions} placeholder="Sélectionnez votre wilaya" value={form.wilaya} onChange={handleChange} required />
                <Select id="monthly_orders" name="monthly_orders" label="Volume de commandes mensuel" options={orderOptions} placeholder="Sélectionnez..." value={form.monthly_orders} onChange={handleChange} required />
                <Button type="button" onClick={nextStep} className="w-full gap-2">
                  Suivant <ArrowRight size={16} />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <Input id="email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} required placeholder="exemple@email.com" />

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">Mot de passe</label>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required placeholder="Votre mot de passe" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-foreground">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input id="confirm_password" name="confirm_password" type={showConfirm ? "text" : "password"} value={form.confirm_password} onChange={handleChange} required placeholder="Confirmez votre mot de passe" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={prevStep} className="flex-1 gap-2">
                    <ArrowLeft size={16} /> Retour
                  </Button>
                  <Button type="submit" loading={loading} className="flex-1">
                    Envoyer la demande
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
