import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposta Comercial — Desenvolvimento Web Profissional",
  description:
    "Proposta personalizada para seu projeto web. Desenvolvimento de sites, aplicativos e sistemas com Next.js, React e Node.js. Emmanuel Bezerra — Desenvolvedor Full-Stack.",
  openGraph: {
    title: "Proposta Comercial | Emmanuel Bezerra Dev",
    description:
      "Proposta personalizada para desenvolvimento web profissional. Next.js, React, Node.js.",
  },
  alternates: {
    canonical: "/proposta",
  },
};

export default function PropostaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
