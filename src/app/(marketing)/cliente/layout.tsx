import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal do Cliente — Acompanhe seu Projeto",
  description:
    "Acesse o portal do cliente para acompanhar o andamento do seu projeto, ver atualizações e se comunicar com o desenvolvedor.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
