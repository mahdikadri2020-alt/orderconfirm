import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrderConfirm DZ | Confirmation WhatsApp automatique pour e-commerçants algériens",
  description: "Réduisez les retours de commandes avec la confirmation automatique WhatsApp. Plateforme conçue pour les e-commerçants algériens.",
  keywords: ["WhatsApp", "confirmation commande", "e-commerce Algérie", "COD", "réduction retours"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
