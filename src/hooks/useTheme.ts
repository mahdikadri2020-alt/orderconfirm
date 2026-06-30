"use client";

import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (saved === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefers);
      if (prefers) document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return { dark, toggleTheme };
}
