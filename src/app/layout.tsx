// ══════════════════════════════════════════════════════════════════════════════
// 🌐 Root Layout — EB Emmanuel Bezerra | Full-Stack Developer
// ══════════════════════════════════════════════════════════════════════════════

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

// ─── Metadata SEO ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://emmanuelbezerra.dev"),
  title: {
    default: "Emmanuel Bezerra | Desenvolvedor Full-Stack",
    template: "%s | Emmanuel Bezerra Dev",
  },
  description:
    "Desenvolvedor Full-Stack especializado em Next.js, React, Node.js, TypeScript e Python. Criação de aplicações web de alta performance, APIs robustas e interfaces modernas.",
  keywords: [
    "desenvolvedor full-stack",
    "full-stack developer",
    "react developer",
    "next.js developer",
    "node.js",
    "typescript",
    "python",
    "freelancer programador",
    "criação de sites",
    "desenvolvimento web",
    "emmanuel bezerra",
    "programador fortaleza",
  ],
  authors: [{ name: "Emmanuel Bezerra", url: "https://github.com/emmanuelbezerradev" }],
  creator: "Emmanuel Bezerra",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Emmanuel Bezerra | Dev Full-Stack",
    title: "Emmanuel Bezerra | Desenvolvedor Full-Stack",
    description:
      "Transformo ideias em código. Aplicações web modernas com Next.js, React, Node.js e mais.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Emmanuel Bezerra — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
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
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0a0a0f" />
      </head>
      <body className="min-h-screen bg-[#0a0a0f] text-[#e2e2ef] antialiased overflow-x-hidden">
        {children}

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

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) {
                      console.log('[PWA] Service Worker registrado:', reg.scope);
                    })
                    .catch(function(err) {
                      console.log('[PWA] SW falhou:', err);
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
