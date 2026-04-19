// ══════════════════════════════════════════════════════════════════════════════
// 🔑 Página Recuperar Senha — Redirect para WhatsApp
// ══════════════════════════════════════════════════════════════════════════════

import { redirect } from "next/navigation";

export default function RecuperarSenhaPage() {
  redirect(
    "https://wa.me/5585998500344?text=Olá%20Emmanuel!%20Preciso%20recuperar%20minha%20senha%20de%20acesso."
  );
}
