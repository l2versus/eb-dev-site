// ══════════════════════════════════════════════════════════════════════════════
// 👤 Portal do Cliente — Login com Código de Acesso
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyRound,
  Mail,
  AlertCircle,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";

export default function ClienteLoginPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se já está logado
  useEffect(() => {
    const stored = localStorage.getItem("clientePortal");
    if (stored) {
      router.push("/cliente/painel");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo) {
      setError("Digite seu código de acesso");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ codigo });
      if (email) params.set("email", email);

      const res = await fetch(`/api/acesso-cliente?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Código inválido");
        return;
      }

      // Salvar dados do cliente no localStorage
      localStorage.setItem("clientePortal", JSON.stringify(data.cliente));
      
      // Redirecionar para o painel
      router.push("/cliente/painel");
    } catch (err) {
      setError("Erro ao validar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/30 via-dark-950 to-dark-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-white block">Emmanuel</span>
              <span className="text-xs text-brand-400">Portal do Cliente</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            Acessar seu Painel
          </h1>
          <p className="text-dark-400">
            Use o código enviado por email ou WhatsApp
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-dark-900 rounded-2xl p-6 sm:p-8 border border-dark-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Código de acesso */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Código de Acesso *
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-500" />
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="Ex: A1B2C3D4"
                  maxLength={8}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-white text-center font-mono text-lg tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
              <p className="text-xs text-dark-500 mt-1">
                O código foi enviado para seu email e/ou WhatsApp
              </p>
            </div>

            {/* Email opcional para validação extra */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email (opcional)
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                icon={<Mail className="h-4 w-4" />}
              />
              <p className="text-xs text-dark-500 mt-1">
                Adicione para maior segurança
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={!codigo || loading}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Acessar Painel
            </Button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-800" />
            <span className="text-xs text-dark-500">ou</span>
            <div className="flex-1 h-px bg-dark-800" />
          </div>

          {/* Não tem código? */}
          <div className="text-center">
            <p className="text-sm text-dark-400 mb-3">
              Não recebeu seu código?
            </p>
            <Link
              href="https://wa.me/5585998500344?text=Olá! Preciso do meu código de acesso ao portal."
              target="_blank"
              className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
            >
              Falar no WhatsApp
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          {/* Demo */}
          <div className="mt-4 pt-4 border-t border-dark-800 text-center">
            <Link
              href="/cliente"
              className="text-xs text-dark-500 hover:text-dark-400 transition-colors"
            >
              ✨ Ver demonstração do painel
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-dark-600 mt-6 flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          Conexão segura · Seus dados estão protegidos
        </p>
      </motion.div>
    </div>
  );
}
