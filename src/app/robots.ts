// ══════════════════════════════════════════════════════════════════════════════
// 🤖 Robots.txt — Controle de Crawlers
// ══════════════════════════════════════════════════════════════════════════════

import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://site-emmanuel.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/login",
          "/cliente/*",
          "/dashboard",
          "/dashboard/*",
          "/anamnese",
          "/evolucao",
          "/offline",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api/*", "/login", "/cliente/*", "/dashboard"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
