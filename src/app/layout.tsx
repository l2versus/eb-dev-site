// ══════════════════════════════════════════════════════════════════════════════
// 🌐 Root Layout — EB Emmanuel Bezerra | Full-Stack Developer
// ══════════════════════════════════════════════════════════════════════════════

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";

// ─── Metadata SEO ─────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://site-emmanuel.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Emmanuel Bezerra | Desenvolvedor Full-Stack em Fortaleza — Sites, Apps & Sistemas",
    template: "%s | Emmanuel Bezerra Dev",
  },
  description:
    "Desenvolvedor Full-Stack em Fortaleza, CE. Especialista em Next.js, React, Node.js, TypeScript e Python. Crio landing pages, aplicações SaaS, e-commerce, sistemas e APIs de alta performance. +15 projetos entregues. Orçamento gratuito.",
  keywords: [
    // Genéricos
    "desenvolvedor full-stack",
    "full-stack developer",
    "programador freelancer",
    "freelancer programador",
    // Localização
    "programador fortaleza",
    "desenvolvedor web fortaleza",
    "criação de sites fortaleza",
    "desenvolvedor fortaleza ceará",
    // Tecnologias
    "react developer",
    "next.js developer",
    "next.js freelancer",
    "node.js developer",
    "typescript developer",
    "python developer",
    "tailwind css",
    "prisma orm",
    // Serviços
    "criação de sites",
    "criação de sites profissionais",
    "desenvolvimento web",
    "landing page profissional",
    "criar landing page",
    "desenvolvimento de aplicativos web",
    "criação de e-commerce",
    "desenvolvimento de sistemas",
    "criação de dashboard",
    "desenvolvimento de api",
    "desenvolvimento saas",
    "sistema web sob medida",
    // Nome
    "emmanuel bezerra",
    "emmanuel bezerra dev",
    "eb dev",
  ],
  authors: [{ name: "Emmanuel Bezerra", url: "https://github.com/emmanuelbezerradev" }],
  creator: "Emmanuel Bezerra",
  publisher: "Emmanuel Bezerra",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Emmanuel Bezerra | Desenvolvedor Full-Stack",
    title: "Emmanuel Bezerra | Desenvolvedor Full-Stack — Fortaleza, CE",
    description:
      "Transformo ideias em código. Landing pages, aplicações SaaS, e-commerce e sistemas web de alta performance com Next.js, React e Node.js. +15 projetos entregues.",
    // OG image gerada automaticamente por opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Bezerra | Desenvolvedor Full-Stack",
    description:
      "Criação de sites, apps e sistemas web de alta performance. Next.js, React, Node.js. Fortaleza, CE.",
    // Twitter image gerada automaticamente por twitter-image.tsx
    creator: "@emmanuelbezerra_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "ZmIiD0G_l9wEx9sBcUz8qsfGY3a2sXwhfQHMgLqFgLI",
  },
  other: {
    "geo.region": "BR-CE",
    "geo.placename": "Fortaleza",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
};

// ─── JSON-LD Dados Estruturados ───────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Emmanuel Bezerra | Desenvolvedor Full-Stack",
      description:
        "Desenvolvedor Full-Stack em Fortaleza, CE. Especialista em Next.js, React, Node.js, TypeScript e Python.",
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#person` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Emmanuel Bezerra",
      alternateName: "EB Dev",
      url: SITE_URL,
      image: `${SITE_URL}/images/foto-perfil.png`,
      jobTitle: "Desenvolvedor Full-Stack",
      description:
        "Desenvolvedor Full-Stack especializado em Next.js, React, Node.js, TypeScript e Python. +15 projetos entregues.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Fortaleza",
        addressRegion: "CE",
        addressCountry: "BR",
      },
      telephone: "+5585998500344",
      email: "emmanuelbezerra1992@gmail.com",
      sameAs: [
        "https://github.com/emmanuelbezerradev",
        "https://instagram.com/emmanuelbezerra_",
        "https://wa.me/5585998500344",
      ],
      knowsAbout: [
        "Next.js",
        "React",
        "Node.js",
        "TypeScript",
        "Python",
        "Tailwind CSS",
        "PostgreSQL",
        "Prisma",
        "Docker",
        "APIs REST",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "Emmanuel Bezerra — Desenvolvimento Web",
      url: SITE_URL,
      image: `${SITE_URL}/images/foto-perfil.png`,
      telephone: "+5585998500344",
      email: "emmanuelbezerra1992@gmail.com",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Fortaleza",
        addressRegion: "CE",
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -3.7172,
        longitude: -38.5433,
      },
      areaServed: [
        { "@type": "Country", name: "Brasil" },
        { "@type": "City", name: "Fortaleza" },
      ],
      serviceType: [
        "Criação de Sites",
        "Desenvolvimento de Aplicações Web",
        "Desenvolvimento de E-commerce",
        "Criação de Landing Pages",
        "Desenvolvimento de Sistemas Web",
        "Desenvolvimento de APIs",
        "Consultoria em Tecnologia",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "15",
        bestRating: "5",
        worstRating: "1",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark overflow-x-hidden">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0a0a0f" />
        {/* JSON-LD Dados Estruturados */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0f] text-[#e2e2ef] antialiased overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111118",
              border: "1px solid #1e1e2e",
              color: "#e2e2ef",
            },
          }}
          richColors
          closeButton
        />

        {/* Service Worker Registration — somente em produção */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) {
                      console.log('[PWA] Service Worker registrado:', reg.scope);
                    })
                    .catch(function(err) {
                      console.log('[PWA] SW falhou:', err);
                    });
                });
              } else if ('serviceWorker' in navigator && window.location.hostname === 'localhost') {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  registrations.forEach(function(registration) {
                    registration.unregister();
                    console.log('[PWA] SW removido em dev:', registration.scope);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
