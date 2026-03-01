// ══════════════════════════════════════════════════════════════════════════════
// 🌸 Demo — Myka Procópio Estética Avançada
// Página de demonstração do projeto para cliente
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Instagram,
  Star,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Heart,
  Award,
  Shield,
  Play,
  ArrowRight,
  MessageCircle,
  Users,
  Zap,
  Menu,
  X,
} from "lucide-react";

// Cores da marca Myka
const colors = {
  primary: "#d4a5a5", // Rosa suave
  secondary: "#f5e6e0", // Nude claro
  accent: "#b8860b", // Dourado
  dark: "#2d2d2d",
  light: "#faf8f6",
};

// Serviços
const servicos = [
  {
    id: 1,
    nome: "Limpeza de Pele Premium",
    descricao: "Limpeza profunda com extração, máscara detox e hidratação",
    preco: "R$ 189",
    tempo: "60 min",
    destaque: false,
    imagem: "🧖‍♀️",
  },
  {
    id: 2,
    nome: "Radiofrequência Facial",
    descricao: "Estímulo de colágeno para firmeza e rejuvenescimento",
    preco: "R$ 280",
    tempo: "45 min",
    destaque: true,
    imagem: "✨",
  },
  {
    id: 3,
    nome: "Peeling Químico",
    descricao: "Renovação celular intensa para manchas e textura",
    preco: "R$ 350",
    tempo: "30 min",
    destaque: false,
    imagem: "🌟",
  },
  {
    id: 4,
    nome: "Drenagem Linfática",
    descricao: "Massagem que elimina toxinas e reduz inchaço",
    preco: "R$ 150",
    tempo: "60 min",
    destaque: false,
    imagem: "💆‍♀️",
  },
  {
    id: 5,
    nome: "Criolipólise",
    descricao: "Redução de gordura localizada por congelamento",
    preco: "R$ 450",
    tempo: "40 min",
    destaque: true,
    imagem: "❄️",
  },
  {
    id: 6,
    nome: "Harmonização Facial",
    descricao: "Procedimentos estéticos para contorno facial",
    preco: "A consultar",
    tempo: "Variável",
    destaque: true,
    imagem: "💎",
  },
];

// Depoimentos
const depoimentos = [
  {
    nome: "Carla Monteiro",
    texto: "Melhor clínica de estética de Fortaleza! A Myka é uma profissional incrível, super atenciosa e os resultados são visíveis desde a primeira sessão.",
    rating: 5,
    foto: "C",
    servico: "Radiofrequência",
  },
  {
    nome: "Amanda Santos",
    texto: "Ambiente lindo, acolhedor e muito profissional. Fiz o peeling e minha pele nunca esteve tão bonita. Super recomendo!",
    rating: 5,
    foto: "A",
    servico: "Peeling",
  },
  {
    nome: "Juliana Ferreira",
    texto: "A criolipólise funcionou muito bem para mim. Perdi medidas reais e o atendimento foi impecável do início ao fim.",
    rating: 5,
    foto: "J",
    servico: "Criolipólise",
  },
];

// Horários disponíveis (mock)
const horariosDisponiveis = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

export default function MykaDemo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);
  const [etapaAgendamento, setEtapaAgendamento] = useState(0);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Banner de Demo */}
      <div className="bg-gradient-to-r from-brand-500 to-purple-500 text-white text-center py-2 text-sm">
        <span className="font-medium">🎨 Demonstração do Projeto</span> — Desenvolvido por{" "}
        <a href="/" className="underline font-bold">Emmanuel Bezerra</a>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f0e6e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a5a5] to-[#b8860b] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif text-[#2d2d2d] tracking-wide">Myka Procópio</h1>
                <p className="text-[10px] text-[#d4a5a5] tracking-[0.2em] uppercase">Estética Avançada</p>
              </div>
            </div>

            {/* Nav Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {["Início", "Serviços", "Sobre", "Depoimentos", "Contato"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-[#2d2d2d] hover:text-[#d4a5a5] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a
                href="#agendar"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4a5a5] to-[#c99393] text-white text-sm font-medium rounded-full hover:shadow-lg transition-all"
              >
                <Calendar className="w-4 h-4" />
                Agendar
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-[#f0e6e0]"
            >
              <div className="px-4 py-4 space-y-4">
                {["Início", "Serviços", "Sobre", "Depoimentos", "Contato"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-[#2d2d2d] hover:text-[#d4a5a5]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="#agendar"
                  className="block w-full text-center py-3 bg-[#d4a5a5] text-white rounded-full"
                >
                  Agendar Agora
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="início" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5e6e0] via-white to-[#faf8f6]" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#d4a5a5]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#b8860b]/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4a5a5]/10 text-[#d4a5a5] text-sm rounded-full mb-6">
                <Award className="w-4 h-4" />
                +5 anos de experiência
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2d2d2d] leading-tight mb-6">
                Realce sua <span className="text-[#d4a5a5]">beleza natural</span> com cuidados especializados
              </h2>
              <p className="text-lg text-[#666] mb-8 max-w-lg">
                Tratamentos estéticos personalizados com tecnologia de ponta e atendimento humanizado. 
                Sua jornada de autocuidado começa aqui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#agendar"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4a5a5] to-[#c99393] text-white font-medium rounded-full hover:shadow-xl transition-all group"
                >
                  Agende sua Avaliação
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://wa.me/5585998500344"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#d4a5a5] text-[#d4a5a5] font-medium rounded-full hover:bg-[#d4a5a5] hover:text-white transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-10 pt-10 border-t border-[#f0e6e0]">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#2d2d2d]">2.500+</p>
                  <p className="text-xs text-[#999]">Clientes atendidas</p>
                </div>
                <div className="h-10 w-px bg-[#f0e6e0]" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#2d2d2d]">4.9★</p>
                  <p className="text-xs text-[#999]">Avaliação Google</p>
                </div>
                <div className="h-10 w-px bg-[#f0e6e0]" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#2d2d2d]">15+</p>
                  <p className="text-xs text-[#999]">Tratamentos</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a5a5] to-[#b8860b] rounded-full opacity-20 blur-2xl" />
                <div className="relative bg-gradient-to-br from-[#f5e6e0] to-white rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#d4a5a5]/20 to-[#b8860b]/10 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-20 h-20 text-[#d4a5a5] mx-auto mb-4" />
                      <p className="text-[#2d2d2d] font-serif text-xl">Imagem da Clínica</p>
                      <p className="text-sm text-[#999]">Ambiente acolhedor</p>
                    </div>
                  </div>
                </div>
                {/* Floating Card */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2d2d2d]">Profissionais Certificados</p>
                      <p className="text-xs text-[#999]">ANVISA + CFE</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="serviços" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4a5a5]/10 text-[#d4a5a5] text-sm rounded-full mb-4">
              <Zap className="w-4 h-4" />
              Nossos Tratamentos
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#2d2d2d] mb-4">
              Serviços Especializados
            </h3>
            <p className="text-[#666] max-w-2xl mx-auto">
              Cada tratamento é personalizado para suas necessidades, utilizando as melhores técnicas e equipamentos do mercado.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map((servico, i) => (
              <motion.div
                key={servico.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative group p-6 rounded-3xl border transition-all hover:shadow-xl ${
                  servico.destaque
                    ? "bg-gradient-to-br from-[#d4a5a5]/5 to-[#b8860b]/5 border-[#d4a5a5]/30"
                    : "bg-white border-[#f0e6e0] hover:border-[#d4a5a5]/30"
                }`}
              >
                {servico.destaque && (
                  <span className="absolute -top-3 right-4 px-3 py-1 bg-[#b8860b] text-white text-xs font-medium rounded-full">
                    Popular
                  </span>
                )}
                <div className="text-4xl mb-4">{servico.imagem}</div>
                <h4 className="text-lg font-semibold text-[#2d2d2d] mb-2">{servico.nome}</h4>
                <p className="text-sm text-[#666] mb-4">{servico.descricao}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#f0e6e0]">
                  <div>
                    <p className="text-xl font-bold text-[#d4a5a5]">{servico.preco}</p>
                    <p className="text-xs text-[#999]">{servico.tempo}</p>
                  </div>
                  <button
                    onClick={() => {
                      setServicoSelecionado(servico.id);
                      document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-4 py-2 bg-[#d4a5a5] text-white text-sm font-medium rounded-full hover:bg-[#c99393] transition-colors"
                  >
                    Agendar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre / Diferenciais */}
      <section id="sobre" className="py-20 bg-gradient-to-br from-[#f5e6e0] to-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-[#d4a5a5] text-sm rounded-full mb-4">
                <Heart className="w-4 h-4" />
                Quem Somos
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif text-[#2d2d2d] mb-6">
                Cuidando da sua beleza com <span className="text-[#d4a5a5]">carinho e expertise</span>
              </h3>
              <p className="text-[#666] mb-6">
                Na Myka Procópio Estética, acreditamos que cada pessoa é única e merece um atendimento
                personalizado. Com mais de 5 anos de experiência, nossa missão é realçar sua beleza
                natural através de tratamentos seguros e eficazes.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: "Equipamentos de última geração" },
                  { icon: Award, text: "Profissionais certificados e especializados" },
                  { icon: Users, text: "Atendimento humanizado e personalizado" },
                  { icon: CheckCircle, text: "Protocolos de segurança rigorosos" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d4a5a5]/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#d4a5a5]" />
                    </div>
                    <span className="text-[#2d2d2d]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#d4a5a5]/20 to-[#b8860b]/10 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-[#d4a5a5] mx-auto mb-4" />
                    <p className="text-[#2d2d2d] font-serif">Conheça nossa clínica</p>
                    <p className="text-sm text-[#999]">Vídeo institucional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4a5a5]/10 text-[#d4a5a5] text-sm rounded-full mb-4">
              <Star className="w-4 h-4" />
              Avaliações
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-[#2d2d2d] mb-4">
              O que nossas clientes dizem
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((dep, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#faf8f6] rounded-3xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(dep.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#b8860b] text-[#b8860b]" />
                  ))}
                </div>
                <p className="text-[#666] mb-6">"{dep.texto}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#f0e6e0]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a5a5] to-[#b8860b] flex items-center justify-center text-white font-medium">
                    {dep.foto}
                  </div>
                  <div>
                    <p className="font-medium text-[#2d2d2d]">{dep.nome}</p>
                    <p className="text-xs text-[#999]">{dep.servico}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agendamento */}
      <section id="agendar" className="py-20 bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4a5a5]/20 text-[#d4a5a5] text-sm rounded-full mb-4">
              <Calendar className="w-4 h-4" />
              Agendamento Online
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif text-white mb-4">
              Agende seu horário
            </h3>
            <p className="text-white/60">
              Escolha o serviço, data e horário de sua preferência
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8">
            {/* Progresso */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {["Serviço", "Data", "Horário", "Dados"].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= etapaAgendamento
                        ? "bg-[#d4a5a5] text-white"
                        : "bg-[#f0e6e0] text-[#999]"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`ml-2 text-sm hidden sm:block ${
                    i <= etapaAgendamento ? "text-[#2d2d2d]" : "text-[#999]"
                  }`}>
                    {step}
                  </span>
                  {i < 3 && <ChevronRight className="w-4 h-4 text-[#ccc] mx-2" />}
                </div>
              ))}
            </div>

            {/* Etapa 1: Serviço */}
            {etapaAgendamento === 0 && (
              <div className="space-y-4">
                <p className="font-medium text-[#2d2d2d] mb-4">Selecione o serviço:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {servicos.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setServicoSelecionado(s.id);
                        setEtapaAgendamento(1);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        servicoSelecionado === s.id
                          ? "border-[#d4a5a5] bg-[#d4a5a5]/5"
                          : "border-[#f0e6e0] hover:border-[#d4a5a5]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.imagem}</span>
                        <div>
                          <p className="font-medium text-[#2d2d2d]">{s.nome}</p>
                          <p className="text-sm text-[#d4a5a5]">{s.preco} • {s.tempo}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Etapa 2: Data */}
            {etapaAgendamento === 1 && (
              <div className="space-y-4">
                <p className="font-medium text-[#2d2d2d] mb-4">Selecione a data:</p>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {[...Array(14)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i + 1);
                    const dia = date.getDate();
                    const mes = date.toLocaleDateString("pt-BR", { month: "short" });
                    const diaSemana = date.toLocaleDateString("pt-BR", { weekday: "short" });
                    const dateStr = date.toISOString().split("T")[0];
                    const isWeekend = date.getDay() === 0;
                    return (
                      <button
                        key={i}
                        disabled={isWeekend}
                        onClick={() => {
                          setDataSelecionada(dateStr);
                          setEtapaAgendamento(2);
                        }}
                        className={`p-3 rounded-xl text-center transition-all ${
                          isWeekend
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : dataSelecionada === dateStr
                            ? "bg-[#d4a5a5] text-white"
                            : "border border-[#f0e6e0] hover:border-[#d4a5a5]"
                        }`}
                      >
                        <p className="text-xs uppercase">{diaSemana}</p>
                        <p className="text-lg font-bold">{dia}</p>
                        <p className="text-xs">{mes}</p>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setEtapaAgendamento(0)}
                  className="text-sm text-[#d4a5a5] hover:underline"
                >
                  ← Voltar
                </button>
              </div>
            )}

            {/* Etapa 3: Horário */}
            {etapaAgendamento === 2 && (
              <div className="space-y-4">
                <p className="font-medium text-[#2d2d2d] mb-4">Selecione o horário:</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {horariosDisponiveis.map((h) => (
                    <button
                      key={h}
                      onClick={() => {
                        setHorarioSelecionado(h);
                        setEtapaAgendamento(3);
                      }}
                      className={`p-3 rounded-xl text-center transition-all ${
                        horarioSelecionado === h
                          ? "bg-[#d4a5a5] text-white"
                          : "border border-[#f0e6e0] hover:border-[#d4a5a5]"
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <p className="font-medium">{h}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setEtapaAgendamento(1)}
                  className="text-sm text-[#d4a5a5] hover:underline"
                >
                  ← Voltar
                </button>
              </div>
            )}

            {/* Etapa 4: Dados */}
            {etapaAgendamento === 3 && (
              <div className="space-y-4">
                <p className="font-medium text-[#2d2d2d] mb-4">Complete seus dados:</p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0e6e0] focus:border-[#d4a5a5] focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp (85) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0e6e0] focus:border-[#d4a5a5] focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className="w-full px-4 py-3 rounded-xl border border-[#f0e6e0] focus:border-[#d4a5a5] focus:outline-none"
                  />
                </div>

                {/* Resumo */}
                <div className="bg-[#faf8f6] rounded-xl p-4 mt-6">
                  <p className="text-sm font-medium text-[#2d2d2d] mb-2">Resumo do agendamento:</p>
                  <div className="text-sm text-[#666] space-y-1">
                    <p>📋 {servicos.find(s => s.id === servicoSelecionado)?.nome}</p>
                    <p>📅 {dataSelecionada && new Date(dataSelecionada + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
                    <p>🕐 {horarioSelecionado}</p>
                  </div>
                </div>

                <button
                  className="w-full py-4 bg-gradient-to-r from-[#d4a5a5] to-[#c99393] text-white font-medium rounded-xl hover:shadow-lg transition-all"
                >
                  Confirmar Agendamento
                </button>
                <button
                  onClick={() => setEtapaAgendamento(2)}
                  className="w-full text-sm text-[#d4a5a5] hover:underline"
                >
                  ← Voltar
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 bg-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#d4a5a5]/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-[#d4a5a5]" />
              </div>
              <h4 className="font-semibold text-[#2d2d2d] mb-2">Localização</h4>
              <p className="text-sm text-[#666]">
                Av. Santos Dumont, 1500<br />
                Aldeota, Fortaleza - CE
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#d4a5a5]/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-[#d4a5a5]" />
              </div>
              <h4 className="font-semibold text-[#2d2d2d] mb-2">Telefone</h4>
              <p className="text-sm text-[#666]">
                (85) 99999-8888<br />
                (85) 3333-4444
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#d4a5a5]/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-[#d4a5a5]" />
              </div>
              <h4 className="font-semibold text-[#2d2d2d] mb-2">Horário</h4>
              <p className="text-sm text-[#666]">
                Seg a Sex: 08h - 19h<br />
                Sáb: 08h - 14h
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d2d2d] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a5a5] to-[#b8860b] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-serif text-white">Myka Procópio</h1>
                <p className="text-[10px] text-[#d4a5a5] tracking-wider">Estética Avançada</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#d4a5a5] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5585998500344" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-emerald-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-white/40">
              © 2025 Myka Procópio. Todos os direitos reservados.
            </p>
          </div>

          {/* Créditos do Dev */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/40">
              Desenvolvido com ❤️ por{" "}
              <a href="/" className="text-[#00f0ff] hover:underline font-medium">
                Emmanuel Bezerra
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
