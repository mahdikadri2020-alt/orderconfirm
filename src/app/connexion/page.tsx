"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

      if (loginError) throw loginError;

      const session = loginData.session;
      if (!session) {
        throw new Error("No session found.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        throw new Error(profileError.message);
      }

      if (!profile) {
        await supabase.auth.signOut();
        throw new Error("No profile found for this account.");
      }

      if (profile.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("common.error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-whatsapp-500 flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold">
              {t("login.title")}
            </h1>

            <p className="text-muted-foreground text-sm mt-1">
              {t("login.subtitle")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm"
          >
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              id="email"
              name="email"
              label={t("login.email")}
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium"
              >
                {t("login.password")}
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-whatsapp-500 hover:text-whatsapp-600"
              >
                {t("login.forgot")}
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {t("login.submit")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("login.noAccount")}{" "}
              <Link
                href="/demande-compte"
                className="text-whatsapp-500 hover:text-whatsapp-600 font-medium"
              >
                {t("login.requestOne")}
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
