import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comparateur de Statuts Freelance — Micro, EURL, SASU",
  description:
    "Simulateur pour comparer Micro-entreprise, EURL et SASU. Calcul en temps réel du revenu net annuel et des charges sociales pour freelances en France.",
  keywords: [
    "freelance",
    "micro-entreprise",
    "EURL",
    "SASU",
    "comparateur",
    "simulateur",
    "charges sociales",
    "revenu net",
  ],
  authors: [{ name: "Guillaume" }],
  openGraph: {
    title: "Comparateur de Statuts Freelance",
    description:
      "Comparez Micro, EURL et SASU en temps réel. Trouvez le statut le plus avantageux pour votre activité.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
