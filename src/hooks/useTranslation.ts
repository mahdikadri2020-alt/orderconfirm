"use client";

import { useState, useCallback, useEffect } from "react";
import { translations } from "@/lib/translations";
import type { Language } from "@/types";

export function useTranslation() {
  const [lang, setLang] = useState<Language>("fr");
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved) {
      setLang(saved);
      setDir(saved === "ar" ? "rtl" : "ltr");
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);

  const toggleLang = useCallback(() => {
    const newLang = lang === "fr" ? "ar" : "fr";
    setLang(newLang);
    const newDir = newLang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLang;
    localStorage.setItem("lang", newLang);
  }, [lang]);

  const t = useCallback(
    (path: string): string => {
      const keys = path.split(".");
      let result: any = translations;
      for (const key of keys) {
        result = result?.[key];
      }
      if (result && typeof result === "object" && lang in result) {
        return result[lang];
      }
      return path;
    },
    [lang]
  );

  return { lang, dir, toggleLang, t };
}
