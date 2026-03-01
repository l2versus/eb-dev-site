// ══════════════════════════════════════════════════════════════════════════════
// 📋 Página de Orçamento — EB Emmanuel Bezerra
// Design Premium com formulário interativo e showcase de tecnologias
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Server,
  Layers,
  Check,
  Send,
  Sparkles,
  Zap,
  Clock,
  Shield,
  Headphones,
  Rocket,
  Globe,
  Smartphone,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Calendar,
  ChevronRight,
  Star,
  BadgeCheck,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const projectTypes = [
  {
    id: "landing",
    icon: Globe,
    title: "Landing Page",
    desc: "Página única focada em conversão",
    price: "A partir de R$ 2.500",
    features: ["Design responsivo", "SEO otimizado", "Formulário de contato", "Analytics integrado"],
    timeline: "5-7 dias",
    color: "#00f0ff",
  },
  {
    id: "institucional",
    icon: Layers,
    title: "Site Institucional",
    desc: "Múltiplas páginas com CMS",
    price: "A partir de R$ 5.500",
    features: ["Até 10 páginas", "Painel admin", "Blog integrado", "Otimização de performance"],
    timeline: "10-14 dias",
    color: "#ff00ff",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Loja virtual completa",
    price: "A partir de R$ 12.000",
    features: ["Catálogo de produtos", "Carrinho + checkout", "Gateway de pagamento", "Gestão de pedidos"],
    timeline: "20-30 dias",
    color: "#00ff41",
  },
  {
    id: "webapp",
    icon: Rocket,
    title: "Web App / SaaS",
    desc: "Sistema web personalizado",
    price: "A partir de R$ 15.000",
    features: ["Autenticação segura", "Dashboard interativo", "APIs customizadas", "Integrações"],
    timeline: "30-60 dias",
    color: "#ffaa00",
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "App Mobile",
    desc: "React Native / PWA",
    price: "A partir de R$ 20.000",
    features: ["iOS + Android", "Notificações push", "Modo offline", "Publicação nas lojas"],
    timeline: "45-90 dias",
    color: "#aa00ff",
  },
];

const addons = [
  { id: "chatbot", icon: MessageSquare, title: "Chatbot com IA", price: "+ R$ 1.500" },
  { id: "analytics", icon: BarChart3, title: "Dashboard Analytics", price: "+ R$ 2.500" },
  { id: "schedule", icon: Calendar, title: "Sistema de Agendamento", price: "+ R$ 3.000" },
  { id: "payments", icon: ShoppingCart, title: "Integração Pagamentos", price: "+ R$ 2.000" },
];

const techShowcase = [
  {
    name: "Next.js 14",
    desc: "Framework React de última geração com Server Components, otimização automática de imagens e SEO perfeito. Seu site carrega em milissegundos.",
    icon: "▲",
    color: "#fff",
  },
  {
    name: "TypeScript",
    desc: "Código 100% tipado significa menos bugs, manutenção mais fácil e confiabilidade. É o padrão da indústria para projetos sérios.",
    icon: "TS",
    color: "#3178c6",
  },
  {
    name: "Tailwind CSS",
    desc: "Sistema de design moderno que garante consistência visual, responsividade perfeita em todos os dispositivos e performance CSS otimizada.",
    icon: "🎨",
    color: "#38bdf8",
  },
  {
    name: "PostgreSQL + Prisma",
    desc: "Banco de dados enterprise-grade com queries otimizadas. Seus dados ficam seguros, organizados e acessíveis de forma eficiente.",
    icon: "◆",
    color: "#2d3748",
  },
  {
    name: "Vercel / AWS",
    desc: "Infraestrutura de nível mundial com CDN global, SSL automático, backups e escalabilidade infinita. O mesmo que Netflix e Airbnb usam.",
    icon: "☁️",
    color: "#ff9900",
  },
];

const guarantees = [
  { icon: Clock, title: "Prazo Garantido", desc: "Compromisso com datas de entrega" },
  { icon: Shield, title: "Código Fonte Seu", desc: "Propriedade total do projeto" },
  { icon: Headphones, title: "Suporte Pós-Entrega", desc: "30 dias de suporte gratuito" },
  { icon: Rocket, title: "Performance A+", desc: "Nota máxima no Google PageSpeed" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function OrcamentoPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula envio (substituir por integração real)
    await new Promise((r) => setTimeout(r, 2000));

    // Monta mensagem para WhatsApp
    const selectedProject = projectTypes.find((p) => p.id === selectedType);
    const selectedAddonNames = selectedAddons
      .map((id) => addons.find((a) => a.id === id)?.title)
      .filter(Boolean)
      .join(", ");

    const message = encodeURIComponent(
      `🚀 *Novo Orçamento*\n\n` +
        `*Nome:* ${formData.name}\n` +
        `*Email:* ${formData.email}\n` +
        `*Telefone:* ${formData.phone}\n` +
        `*Empresa:* ${formData.company || "Não informado"}\n\n` +
        `*Tipo de Projeto:* ${selectedProject?.title || "Não selecionado"}\n` +
        `*Recursos Adicionais:* ${selectedAddonNames || "Nenhum"}\n` +
        `*Orçamento Estimado:* ${formData.budget || "Não informado"}\n` +
        `*Prazo Desejado:* ${formData.deadline || "Não informado"}\n\n` +
        `*Descrição do Projeto:*\n${formData.description}`
    );

    window.open(`https://wa.me/5585998500344?text=${message}`, "_blank");
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Backgrounds */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#00f0ff]/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ff00ff]/[0.03] rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 py-6 border-b border-[#1e1e2e]">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6b6b80] hover:text-[#00f0ff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao portfólio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-8">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-sm font-mono text-[#00f0ff]">
                Orçamento Personalizado
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Vamos transformar sua
              <br />
              <span className="gradient-text-cyber">ideia em realidade</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-[#6b6b80] max-w-2xl mx-auto">
              Preencha o formulário abaixo para receber um orçamento detalhado
              e personalizado para o seu projeto. Respondo em até 24 horas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Guarantees */}
      <section className="relative z-10 py-12 border-y border-[#1e1e2e] bg-[#0a0a0f]/80">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {guarantees.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.1}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
                    <g.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{g.title}</div>
                    <div className="text-xs text-[#6b6b80]">{g.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-16"
              >
                {/* Step 1: Project Type */}
                <div>
                  <Reveal>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00f0ff] text-black text-sm font-bold">
                        1
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Tipo de Projeto
                      </h2>
                    </div>
                  </Reveal>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projectTypes.map((type, i) => (
                      <Reveal key={type.id} delay={i * 0.05}>
                        <motion.button
                          type="button"
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedType(type.id)}
                          className={`relative w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                            selectedType === type.id
                              ? "border-[#00f0ff]/50 bg-[#00f0ff]/5"
                              : "border-[#1e1e2e] bg-[#0f0f18] hover:border-[#1e1e2e]/80"
                          }`}
                        >
                          {/* Selected indicator */}
                          {selectedType === type.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#00f0ff] text-black"
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          )}

                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                            style={{
                              background: `${type.color}15`,
                              border: `1px solid ${type.color}25`,
                              color: type.color,
                            }}
                          >
                            <type.icon className="w-6 h-6" />
                          </div>

                          <h3 className="text-lg font-bold text-white mb-1">
                            {type.title}
                          </h3>
                          <p className="text-sm text-[#6b6b80] mb-4">
                            {type.desc}
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <span style={{ color: type.color }} className="font-semibold">
                              {type.price}
                            </span>
                            <span className="text-[#6b6b80] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {type.timeline}
                            </span>
                          </div>

                          {/* Features on hover/selected */}
                          <AnimatePresence>
                            {selectedType === type.id && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 pt-4 border-t border-[#1e1e2e] space-y-2 overflow-hidden"
                              >
                                {type.features.map((f) => (
                                  <li key={f} className="flex items-center gap-2 text-sm text-[#9999ab]">
                                    <Check className="w-3 h-3 text-[#00ff41]" />
                                    {f}
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </Reveal>
                    ))}
                  </div>
                </div>

                {/* Step 2: Addons */}
                <div>
                  <Reveal>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff00ff] text-black text-sm font-bold">
                        2
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Recursos Adicionais{" "}
                        <span className="text-[#6b6b80] text-base font-normal">(opcional)</span>
                      </h2>
                    </div>
                  </Reveal>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {addons.map((addon, i) => (
                      <Reveal key={addon.id} delay={i * 0.05}>
                        <motion.button
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleAddon(addon.id)}
                          className={`relative w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                            selectedAddons.includes(addon.id)
                              ? "border-[#ff00ff]/50 bg-[#ff00ff]/5"
                              : "border-[#1e1e2e] bg-[#0f0f18] hover:border-[#1e1e2e]/80"
                          }`}
                        >
                          {selectedAddons.includes(addon.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff00ff] text-black"
                            >
                              <Check className="w-3 h-3" />
                            </motion.div>
                          )}

                          <addon.icon className="w-5 h-5 text-[#ff00ff] mb-2" />
                          <div className="text-sm font-semibold text-white mb-1">
                            {addon.title}
                          </div>
                          <div className="text-xs text-[#ff00ff]">{addon.price}</div>
                        </motion.button>
                      </Reveal>
                    ))}
                  </div>
                </div>

                {/* Step 3: Contact Info */}
                <div>
                  <Reveal>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00ff41] text-black text-sm font-bold">
                        3
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Suas Informações
                      </h2>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                          placeholder="Seu nome"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Empresa / Marca
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                          placeholder="Nome da empresa"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Orçamento estimado
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                        >
                          <option value="">Selecione...</option>
                          <option value="ate-2k">Até R$ 2.000</option>
                          <option value="2k-5k">R$ 2.000 - R$ 5.000</option>
                          <option value="5k-10k">R$ 5.000 - R$ 10.000</option>
                          <option value="10k-20k">R$ 10.000 - R$ 20.000</option>
                          <option value="acima-20k">Acima de R$ 20.000</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Prazo desejado
                        </label>
                        <select
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                        >
                          <option value="">Selecione...</option>
                          <option value="urgente">Urgente (menos de 15 dias)</option>
                          <option value="1-mes">1 mês</option>
                          <option value="2-meses">2 meses</option>
                          <option value="3-meses">3 meses ou mais</option>
                          <option value="flexivel">Flexível</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Descreva seu projeto *
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors resize-none"
                          placeholder="Descreva sua ideia, funcionalidades desejadas, referências de sites que gosta, público-alvo..."
                        />
                      </div>
                    </div>
                  </Reveal>

                  {/* Submit */}
                  <Reveal delay={0.2}>
                    <div className="mt-10">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !selectedType}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-black bg-[#00f0ff] hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                            />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Solicitar Orçamento
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>

                      {!selectedType && (
                        <p className="text-sm text-[#ff00ff] mt-3">
                          * Selecione um tipo de projeto para continuar
                        </p>
                      )}
                    </div>
                  </Reveal>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00ff41]/10 border border-[#00ff41]/20 mx-auto mb-8"
                >
                  <BadgeCheck className="w-10 h-10 text-[#00ff41]" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  Orçamento Enviado!
                </h2>
                <p className="text-[#6b6b80] mb-8">
                  Recebi sua solicitação e responderei em até 24 horas pelo
                  WhatsApp ou email. Fique de olho!
                </p>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Portfólio
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Tech Showcase */}
      <section className="relative z-10 py-20 border-t border-[#1e1e2e]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Tecnologias que uso no seu projeto
              </h2>
              <p className="text-[#6b6b80] max-w-2xl mx-auto">
                Stack moderna e comprovada para garantir performance,
                segurança e escalabilidade
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techShowcase.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold mb-4"
                    style={{
                      background: `${tech.color}15`,
                      border: `1px solid ${tech.color}25`,
                      color: tech.color,
                    }}
                  >
                    {tech.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{tech.name}</h3>
                  <p className="text-sm text-[#6b6b80] leading-relaxed">{tech.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="relative z-10 py-20 border-t border-[#1e1e2e]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Por que escolher{" "}
                <span className="neon-text-cyan">meus serviços</span>?
              </h2>
              <p className="text-[#6b6b80] max-w-2xl mx-auto">
                Diferenciais que fazem a diferença no resultado final
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Comunicação Transparente",
                desc: "Updates semanais, acesso direto via WhatsApp, sem intermediários. Você fala direto comigo.",
                stat: "< 2h",
                statLabel: "tempo de resposta",
                color: "#00f0ff",
              },
              {
                title: "Código de Qualidade",
                desc: "TypeScript, testes automatizados, documentação completa. Código que outros devs entendem.",
                stat: "A+",
                statLabel: "PageSpeed score",
                color: "#ff00ff",
              },
              {
                title: "Entrega Garantida",
                desc: "Prazo definido em contrato. Se atrasar, você ganha desconto. Simples assim.",
                stat: "100%",
                statLabel: "projetos no prazo",
                color: "#00ff41",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-8 h-full border border-[#1e1e2e] hover:border-[color:var(--item-color)]/30 transition-all"
                  style={{ "--item-color": item.color } as React.CSSProperties}
                >
                  <div 
                    className="text-4xl font-black mb-2"
                    style={{ color: item.color, textShadow: `0 0 20px ${item.color}40` }}
                  >
                    {item.stat}
                  </div>
                  <div className="text-xs text-[#6b6b80] font-mono uppercase tracking-wider mb-6">
                    {item.statLabel}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-[#9999ab]">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Logos */}
      <section className="relative z-10 py-16 border-t border-[#1e1e2e] bg-[#08080d]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-center text-sm text-[#6b6b80] mb-8 font-mono">
              EMPRESAS QUE CONFIAM NO MEU TRABALHO
            </p>
          </Reveal>
          
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            {[
              { name: "L2 Versus", icon: "⚔️" },
              { name: "Myka Clínica", icon: "💆" },
              { name: "TechStartup", icon: "🚀" },
              { name: "E-commerce Plus", icon: "🛒" },
              { name: "Consultoria Pro", icon: "📊" },
            ].map((company, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-center gap-2 text-xl font-bold text-white">
                  <span>{company.icon}</span>
                  <span>{company.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 border-t border-[#1e1e2e]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/20 mb-6">
              <Star className="w-3 h-3 text-[#00ff41]" />
              <span className="text-xs font-mono text-[#00ff41]">100% de clientes satisfeitos</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Prefere conversar diretamente?
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-[#6b6b80] mb-8">
              Sem problema! Me chama no WhatsApp que responderei rapidamente.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <a
              href="https://wa.me/5585998500344"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black bg-[#00ff41] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)] transition-all"
            >
              <Zap className="w-5 h-5" />
              Chamar no WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
