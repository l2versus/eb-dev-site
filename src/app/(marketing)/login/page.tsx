// ══════════════════════════════════════════════════════════════════════════════
// 🔑 Página de Login — OAuth + Credenciais com design premium
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/utils/validations";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  AlertCircle,
} from "lucide-react";
import type { z } from "zod";

type LoginForm = z.infer<typeof loginSchema>;

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha inválidos");
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (e) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <section className="min-h-screen flex">
      {/* ═══ Lado Esquerdo — Branding ════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-dark-900">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/50 via-dark-900 to-dark-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl" />

        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="mb-8">
            <img
              src="/images/logo-banner.png"
              alt="Emmanuel Bezerra"
              className="h-16 w-auto mx-auto mb-6 object-contain"
            />
          </div>
          <h2 className="font-display text-3xl text-white mb-4">
            Acesso <span className="gradient-text-brand">Administrativo</span>
          </h2>
          <p className="text-dark-300 leading-relaxed">
            Painel exclusivo para gestão de clientes, projetos, propostas
            e acompanhamento financeiro do seu negócio.
          </p>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 mt-8 text-xs text-dark-500">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              Criptografia AES-256
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              LGPD Compliant
            </span>
          </div>

          {/* Mockup */}
          <div className="mt-10 relative">
            <div className="aspect-[9/16] max-w-[220px] mx-auto rounded-3xl border border-dark-700/50 overflow-hidden shadow-2xl">
              <img
                src="/images/mockup-phone.png"
                alt="App mobile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Lado Direito — Formulário ═══════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-dark-950">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Emmanuel</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Login Administrativo
            </h1>
            <p className="text-dark-400 text-sm">
              Acesse o painel de controle do sistema
            </p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-dark-700 bg-dark-800/50 text-white hover:bg-dark-800 transition-colors mb-6"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar com Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-dark-800" />
            <span className="text-xs text-dark-500 uppercase tracking-wider">
              ou com email
            </span>
            <div className="flex-1 h-px bg-dark-800" />
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Mensagem de erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-dark-500 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="/recuperar-senha"
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Entrar
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-dark-400 mt-6">
            Não tem conta?{" "}
            <Link
              href="/registro"
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Cadastre-se grátis
            </Link>
          </p>

          {/* Security note */}
          <p className="text-center text-[10px] text-dark-600 mt-8 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Conexão segura · Dados protegidos por criptografia AES-256
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-dark-950">
          <div className="animate-pulse text-dark-400 text-sm">Carregando...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}