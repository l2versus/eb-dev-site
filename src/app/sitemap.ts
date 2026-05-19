// ══════════════════════════════════════════════════════════════════════════════
// 🗺️ Sitemap Dinâmico — SEO Profissional
// Gera automaticamente o sitemap.xml para crawlers
// ══════════════════════════════════════════════════════════════════════════════

import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://site-emmanuel.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Páginas públicas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/orcamento`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/proposta`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/agendamento`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/demo/myka`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return staticPages;
}
