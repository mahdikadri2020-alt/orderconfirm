import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("fr-DZ") + " DA";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-DZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-DZ", {
    day: "numeric",
    month: "short",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "no_response":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function getStatusLabel(status: string, lang: "fr" | "ar"): string {
  const labels: Record<string, { fr: string; ar: string }> = {
    pending: { fr: "En attente", ar: "قيد الانتظار" },
    confirmed: { fr: "Confirmée", ar: "مؤكدة" },
    cancelled: { fr: "Annulée", ar: "ملغية" },
    no_response: { fr: "Sans réponse", ar: "بدون رد" },
  };
  return labels[status]?.[lang] || status;
}

export function getWilayas(): string[] {
  return [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa",
    "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa",
    "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel",
    "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès",
    "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
    "Aïn Témouchent", "Ghardaïa", "Relizane",
  ];
}

export function getMonthlyOrderOptions(lang: "fr" | "ar") {
  return [
    { value: "1-50", label: lang === "fr" ? "1–50 commandes" : "1–50 طلب" },
    { value: "50-200", label: lang === "fr" ? "50–200 commandes" : "50–200 طلب" },
    { value: "200-500", label: lang === "fr" ? "200–500 commandes" : "200–500 طلب" },
    { value: "500+", label: lang === "fr" ? "500+ commandes" : "500+ طلب" },
  ];
}
