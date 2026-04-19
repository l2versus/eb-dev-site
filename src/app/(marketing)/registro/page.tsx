// ══════════════════════════════════════════════════════════════════════════════
// 📝 Página de Registro — Redirect para WhatsApp
// ══════════════════════════════════════════════════════════════════════════════

import { redirect } from "next/navigation";

export default function RegistroPage() {
  redirect(
    "https://wa.me/5585998500344?text=Olá%20Emmanuel!%20Gostaria%20de%20criar%20uma%20conta%20no%20sistema."
  );
}
