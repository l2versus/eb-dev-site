import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orçamento Gratuito — Criação de Sites e Aplicações Web",
  description:
    "Solicite um orçamento gratuito para criação de landing pages, e-commerce, sistemas web, dashboards e aplicações SaaS. Desenvolvedor Full-Stack em Fortaleza, CE. Resposta em até 2h.",
  openGraph: {
    title: "Orçamento Gratuito | Emmanuel Bezerra Dev",
    description:
      "Solicite um orçamento gratuito para seu projeto web. Landing pages a partir de R$997. Resposta em até 2h.",
  },
  alternates: {
    canonical: "/orcamento",
  },
};

export default function OrcamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
