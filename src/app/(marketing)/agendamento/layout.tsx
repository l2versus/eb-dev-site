import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendamento — Marque sua Consulta ou Reunião",
  description:
    "Agende uma consulta, reunião ou discovery call com Emmanuel Bezerra. Desenvolvedor Full-Stack em Fortaleza, CE. Horários flexíveis.",
  openGraph: {
    title: "Agendamento | Emmanuel Bezerra Dev",
    description:
      "Agende uma reunião ou discovery call para discutir seu projeto web.",
  },
  alternates: {
    canonical: "/agendamento",
  },
};

export default function AgendamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
