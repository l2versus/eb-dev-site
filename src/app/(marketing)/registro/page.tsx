"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  KeyRound,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";

type CadastroResponse = {
  success?: boolean;
  error?: string;
  cliente?: {
    id: string;
    nome: string;
    email: string;
    telefone?: string | null;
    empresa?: string | null;
  };
  acesso?: {
    codigoAcesso: string;
  };
};

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    projeto: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState("");

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => ({}))) as CadastroResponse;

      if (!response.ok || !data.cliente || !data.acesso) {
        throw new Error(data.error || "Nao foi possivel concluir o cadastro.");
      }

      localStorage.setItem("clientePortal", JSON.stringify(data.cliente));
      setCodigo(data.acesso.codigoAcesso);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao concluir cadastro.");
    } finally {
      setLoading(false);
    }
  };

  const enterPortal = () => {
    router.push("/cliente/painel");
  };

  return (
    <main className="min-h-screen bg-[#0d0d0b] px-5 py-28 text-[#f5f0e6] sm:px-8 lg:px-12">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(245,240,230,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(245,240,230,0.035)_1px,transparent_1px)] bg-[size:92px_92px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,192,144,0.12),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(139,183,214,0.1),transparent_30%)]" />

      <div className="relative mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.92fr_1fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/cliente/login"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#f5f0e6]/55 transition-colors hover:text-[#ffc090]"
          >
            <ArrowLeft className="h-4 w-4" />
            Portal do cliente
          </Link>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.28em] text-[#ffc090]">
            Cadastro / Area cliente
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(3.4rem,7vw,7.4rem)] leading-[0.86]">
            Entre no painel sem esperar atendimento.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#d7c7b7]">
            O cadastro cria seu lead no CRM, libera um codigo de acesso e deixa o
            painel pronto para propostas, projetos e pagamentos.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {["Lead no admin", "Codigo imediato", "Painel liberado"].map((item) => (
              <div
                key={item}
                className="border border-[#f5f0e6]/12 bg-[#f5f0e6]/[0.04] p-4 text-sm text-[#d7c7b7]"
              >
                <BadgeCheck className="mb-3 h-5 w-5 text-[#9fcaab]" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="border border-[#f5f0e6]/14 bg-[#151411]/88 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8"
        >
          {codigo ? (
            <div className="space-y-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9fcaab] text-[#10100e]">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ffc090]">
                  Cadastro concluido
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Seu codigo de acesso
                </h2>
                <div className="mt-5 border border-[#ffc090]/24 bg-black/28 px-5 py-4 font-mono text-2xl tracking-[0.32em] text-[#ffc090]">
                  {codigo}
                </div>
                <p className="mt-4 text-sm leading-6 text-[#cfc0af]">
                  Guarde esse codigo. O painel ja esta liberado neste navegador.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={enterPortal}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ffc090] px-5 text-sm font-semibold text-[#14110e] transition-colors hover:bg-[#f5f0e6]"
                >
                  Entrar no painel
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="/orcamento"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#f5f0e6]/18 px-5 text-sm font-semibold text-[#f5f0e6] transition-colors hover:border-[#ffc090] hover:text-[#ffc090]"
                >
                  Fazer orcamento
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ffc090] text-[#14110e]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-3xl font-semibold text-white">
                  Criar acesso
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#cfc0af]">
                  Preencha os dados para abrir seu painel de cliente.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 border border-red-500/24 bg-red-500/10 p-3 text-sm text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Field icon={<UserRound className="h-4 w-4" />} label="Nome completo">
                <input
                  required
                  value={form.nome}
                  onChange={(event) => update("nome", event.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="Seu nome"
                />
              </Field>

              <Field icon={<Mail className="h-4 w-4" />} label="Email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="voce@email.com"
                />
              </Field>

              <Field icon={<Phone className="h-4 w-4" />} label="WhatsApp">
                <input
                  required
                  value={form.telefone}
                  onChange={(event) => update("telefone", event.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="(85) 99999-9999"
                />
              </Field>

              <Field icon={<Building2 className="h-4 w-4" />} label="Empresa">
                <input
                  value={form.empresa}
                  onChange={(event) => update("empresa", event.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="Opcional"
                />
              </Field>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#d7c7b7]">
                  Projeto ou necessidade
                </span>
                <div className="flex min-h-[120px] gap-3 border border-[#f5f0e6]/14 bg-black/24 px-4 py-3 text-sm text-white transition-colors focus-within:border-[#ffc090]/58">
                  <MessageSquare className="mt-1 h-4 w-4 shrink-0 text-[#ffc090]" />
                  <textarea
                    value={form.projeto}
                    onChange={(event) => update("projeto", event.target.value)}
                    className="min-h-[94px] w-full resize-none bg-transparent outline-none placeholder:text-[#f5f0e6]/32"
                    placeholder="Ex: landing page, sistema, dashboard, loja..."
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ffc090] px-5 text-sm font-semibold text-[#14110e] transition-colors hover:bg-[#f5f0e6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Criar cadastro
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>
          )}
        </motion.section>
      </div>
    </main>
  );
}

function Field({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#d7c7b7]">
        {label}
      </span>
      <div className="flex h-12 items-center gap-3 border border-[#f5f0e6]/14 bg-black/24 px-4 text-sm text-white transition-colors focus-within:border-[#ffc090]/58">
        <span className="text-[#ffc090]">{icon}</span>
        {children}
      </div>
    </label>
  );
}
