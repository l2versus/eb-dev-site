// ══════════════════════════════════════════════════════════════════════════════
// 🏠 EB Emmanuel Bezerra — Portfolio Cyberpunk
// Design Sênior: Parallax, 3D Tilt, Reveal Cinematográfico, Neon Glow
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Instagram,
  Mail,
  ExternalLink,
  ArrowDown,
  Code2,
  Server,
  Layers,
  Send,
  MapPin,
  Phone,
  ChevronRight,
  Zap,
  Sparkles,
  MousePointer2,
  Braces,
  Database,
  Globe,
  Cpu,
  X,
  FileText,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Reveal animation (cinematic entrance) ────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  className?: string;
  once?: boolean;
}) {
  const initial: Record<string, number> = { opacity: 0 };
  if (direction === "up") initial.y = 60;
  if (direction === "down") initial.y = -60;
  if (direction === "left") initial.x = 80;
  if (direction === "right") initial.x = -80;
  if (direction === "scale") {
    initial.scale = 0.85;
    initial.y = 30;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Staggered Reveal (para listas) ───────────────────────────────────────────
function StaggerReveal({
  children,
  staggerDelay = 0.1,
  className = "",
}: {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.95 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                delay: i * staggerDelay,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Parallax Section Divider ─────────────────────────────────────────────────
function ParallaxDivider({ color = "#00f0ff" }: { color?: string }) {
  return (
    <div className="relative h-32 overflow-hidden">
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
        style={{ background: color, boxShadow: `0 0 20px ${color}60` }}
      />
    </div>
  );
}

// ─── Image Reveal Animation ───────────────────────────────────────────────────
function ImageReveal({
  children,
  direction = "left",
  className = "",
}: {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}) {
  const clipPaths = {
    left: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
    right: ["inset(0 0 0 100%)", "inset(0 0 0 0%)"],
    up: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
    down: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"],
  };

  return (
    <motion.div
      initial={{ clipPath: clipPaths[direction][0], opacity: 0.5 }}
      whileInView={{ clipPath: clipPaths[direction][1], opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Tech Modal ───────────────────────────────────────────────────────────────
function TechModal({
  tech,
  onClose,
}: {
  tech: { name: string; icon: string; cat: string; level: number; desc: string } | null;
  onClose: () => void;
}) {
  if (!tech) return null;

  const catColors: Record<string, string> = {
    Frontend: "#00f0ff",
    Backend: "#ff00ff",
    DevOps: "#00ff41",
  };

  const color = catColors[tech.cat] || "#00f0ff";

  return (
    <AnimatePresence>
      {tech && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border overflow-hidden"
            style={{
              borderColor: `${color}30`,
              background: "linear-gradient(145deg, #0f0f18 0%, #0a0a0f 100%)",
              boxShadow: `0 0 60px ${color}15, 0 25px 50px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute top-0 left-0 right-0 h-32 opacity-30"
              style={{
                background: `radial-gradient(ellipse at top, ${color}30 0%, transparent 70%)`,
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/5 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative p-8">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl mb-6"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  boxShadow: `0 0 30px ${color}20`,
                }}
              >
                {tech.icon}
              </motion.div>

              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4"
                style={{
                  background: `${color}15`,
                  color: color,
                  border: `1px solid ${color}25`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                {tech.cat}
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-4"
              >
                {tech.name}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-[#9999ab] leading-relaxed mb-6"
              >
                {tech.desc}
              </motion.p>

              {/* Skill bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#6b6b80] font-mono">Proficiência</span>
                  <span className="font-bold" style={{ color }}>{tech.level}%</span>
                </div>
                <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tech.level}%` }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${color}, ${color}aa)`,
                      boxShadow: `0 0 10px ${color}50`,
                    }}
                  />
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-6 border-t border-[#1e1e2e]"
              >
                <p className="text-sm text-[#6b6b80] text-center">
                  Quer saber mais sobre como uso {tech.name} nos meus projetos?
                </p>
                <Link
                  href="/orcamento"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                    color: "#0a0a0f",
                    boxShadow: `0 0 30px ${color}30`,
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Solicitar Orçamento
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Magnetic hover button ────────────────────────────────────────────────────
function MagneticButton({
  children,
  className = "",
  href,
  target,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    },
    [x, y]
  );

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FAQItem({
  faq,
  index,
}: {
  faq: { q: string; a: string; color: string };
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Reveal delay={index * 0.1}>
      <motion.div
        className="glass-card rounded-2xl border border-[#1e1e2e] overflow-hidden"
        style={{
          borderColor: isOpen ? `${faq.color}30` : undefined,
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
        >
          <span className="font-bold text-white pr-4">{faq.q}</span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-2xl flex-shrink-0"
            style={{ color: faq.color }}
          >
            +
          </motion.span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                className="px-6 pb-6 text-[#9999ab] leading-relaxed border-t"
                style={{ borderColor: `${faq.color}15` }}
              >
                <p className="pt-4">{faq.a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  );
}

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        rotateX.set(((e.clientY - centerY) / rect.height) * -8);
        rotateY.set(((e.clientX - centerX) / rect.width) * 8);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Typewriter cursor effect ─────────────────────────────────────────────────
function Typewriter({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const target = texts[idx];
    const speed = del ? 30 : 70;
    const t = setTimeout(() => {
      if (!del) {
        setText(target.substring(0, text.length + 1));
        if (text === target) setTimeout(() => setDel(true), 2500);
      } else {
        setText(target.substring(0, text.length - 1));
        if (text === "") {
          setDel(false);
          setIdx((p) => (p + 1) % texts.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, idx, texts]);

  return (
    <span>
      <span className="gradient-text-cyber font-mono font-semibold">{text}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="text-[#00f0ff] ml-0.5"
      >
        ▊
      </motion.span>
    </span>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          let start = 0;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, started]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Floating particles ──────────────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background:
              i % 3 === 0
                ? "rgba(0,240,255,0.4)"
                : i % 3 === 1
                ? "rgba(255,0,255,0.3)"
                : "rgba(0,255,65,0.3)",
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const techStack = [
  { name: "React", icon: "⚛️", cat: "Frontend", level: 95, desc: "A biblioteca que constrói a interface do seu site. Imagina LEGO: cada peça é um componente reutilizável (botão, menu, card). Isso torna o desenvolvimento mais rápido e o site mais fluido." },
  { name: "Next.js", icon: "▲", cat: "Frontend", level: 92, desc: "O framework que turbina o React. Ele faz seu site carregar ultra-rápido, aparecer bem no Google (SEO) e funciona tanto no servidor quanto no navegador. É o padrão de mercado." },
  { name: "TypeScript", icon: "TS", cat: "Frontend", level: 90, desc: "Uma versão mais segura do JavaScript. É como escrever com corretor ortográfico — pega erros antes de acontecerem. Resultado: menos bugs e código mais confiável." },
  { name: "Tailwind", icon: "🎨", cat: "Frontend", level: 95, desc: "Sistema de design que agiliza a criação visual. Ao invés de escrever CSS do zero, uso classes prontas para montar layouts bonitos e responsivos em tempo recorde." },
  { name: "Node.js", icon: "🟢", cat: "Backend", level: 88, desc: "O motor que roda o servidor do seu site. Processa formulários, pagamentos, logins — toda a lógica que acontece nos bastidores. É o mesmo que Netflix e PayPal usam." },
  { name: "Python", icon: "🐍", cat: "Backend", level: 82, desc: "Linguagem versátil usada para automações, inteligência artificial e dados. Se seu projeto precisa de chatbot, análise de dados ou integração com IA, Python resolve." },
  { name: "PostgreSQL", icon: "🐘", cat: "Backend", level: 85, desc: "O banco de dados — onde ficam guardados os cadastros, pedidos, agendamentos. É robusto, gratuito e usado por empresas como Instagram e Spotify." },
  { name: "Prisma", icon: "◆", cat: "Backend", level: 88, desc: "Ferramenta que simplifica o acesso ao banco de dados. Ao invés de escrever consultas complexas, uso comandos intuitivos. Menos tempo codando = mais rápido pra você." },
  { name: "Docker", icon: "🐳", cat: "DevOps", level: 80, desc: "Empacota o projeto inteiro numa 'caixa' que funciona igual em qualquer lugar. Não importa se é meu computador ou o servidor — o sistema roda identicamente." },
  { name: "Git", icon: "🔀", cat: "DevOps", level: 92, desc: "Sistema de controle de versões — como um 'histórico' de todas as alterações do código. Se algo der errado, volto no tempo. Também permite trabalho em equipe organizado." },
  { name: "Linux", icon: "🐧", cat: "DevOps", level: 85, desc: "O sistema operacional onde seu site vive na internet. É gratuito, ultra-seguro e é o que 96% dos servidores do mundo usam. Seu projeto fica em mãos confiáveis." },
  { name: "AWS", icon: "☁️", cat: "DevOps", level: 75, desc: "A nuvem da Amazon — onde seu site fica hospedado. Escala automaticamente conforme cresce: 10 ou 10 mil acessos, funciona igual. Netflix, Airbnb e NASA usam." },
];

const projects = [
  {
    title: "L2 Versus",
    subtitle: "Game Platform",
    description:
      "Plataforma completa para Lineage 2 — sistema de ranking, loja virtual com pagamentos, painel admin e integração em tempo real com o game server. Milhares de jogadores ativos.",
    tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    link: "https://www.l2versus.com",
    image: "/images/project-l2versus.png",
    color: "#00f0ff",
    number: "01",
  },
  {
    title: "Myka Procópio",
    subtitle: "SaaS Clínica",
    description:
      "Sistema completo para clínica de estética — agendamento online, pagamentos PIX via Mercado Pago, dashboard financeiro, chatbot IA, notificações WhatsApp e controle de evolução.",
    tags: ["Next.js", "Prisma", "Mercado Pago", "NextAuth", "Tailwind"],
    link: "https://www.mykaprocopio.com.br",
    image: "/images/project-estetica.png",
    color: "#ff00ff",
    number: "02",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  // Parallax for about photo
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(aboutProgress, [0, 1], [60, -60]);
  const photoRotate = useTransform(aboutProgress, [0, 1], [-3, 3]);

  // Estado para o modal de tecnologias
  const [selectedTech, setSelectedTech] = useState<typeof techStack[0] | null>(null);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Cinematic Full-Screen
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-24 lg:pt-20"
      >
        {/* Layered backgrounds */}
        <div className="absolute inset-0 cyber-grid" />
        <Particles />

        {/* Radial glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-1/4 -left-48 w-[600px] h-[600px] bg-[#00f0ff] rounded-full blur-[200px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.03, 0.06, 0.03] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute bottom-0 -right-48 w-[500px] h-[500px] bg-[#ff00ff] rounded-full blur-[200px]"
        />

        {/* Content: Text left + Photo right */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left — Text */}
          <div className="text-center lg:text-left">
            {/* Status badge */}
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-8">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 rounded-full bg-[#00ff41]"
                />
                <span className="text-sm font-mono text-[#6b6b80]">
                  Disponível para projetos
                </span>
              </div>
            </Reveal>

            {/* Greeting */}
            <Reveal delay={0.2}>
              <p className="text-[#6b6b80] text-lg mb-3 font-mono">
                <span className="text-[#00f0ff]">{">"}</span> Olá, eu sou
              </p>
            </Reveal>

            {/* Name */}
            <Reveal delay={0.3}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-2 leading-[0.95]">
                <span className="text-white">Emmanuel</span>
                <br />
                <span className="gradient-text-cyber">Bezerra</span>
              </h1>
            </Reveal>

            {/* Typewriter */}
            <Reveal delay={0.5}>
              <div className="text-xl sm:text-2xl font-light mt-4 mb-8 h-10">
                <Typewriter
                  texts={[
                    "Full-Stack Developer",
                    "Next.js & React Expert",
                    "Node.js & Python",
                    "UI/UX Enthusiast",
                  ]}
                />
              </div>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.6}>
              <p className="text-[#6b6b80] max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed text-lg">
                Crio aplicações web de alta performance com código
                limpo, arquitetura escalável e design que converte.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.7}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <MagneticButton
                  href="#projetos"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black bg-[#00f0ff] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-500"
                >
                  <Sparkles className="h-4 w-4" />
                  Ver Projetos
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>

                <Link
                  href="/orcamento"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black bg-[#00ff41] hover:shadow-[0_0_40px_rgba(0,255,65,0.5)] transition-all duration-500"
                >
                  <FileText className="h-4 w-4" />
                  Orçamento
                </Link>

                <MagneticButton
                  href="#contato"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold border border-[#1e1e2e] text-white hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/5 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all duration-500"
                >
                  Fale Comigo
                </MagneticButton>
              </div>
            </Reveal>

            {/* Social icons */}
            <Reveal delay={0.9}>
              <div className="flex items-center justify-center lg:justify-start gap-5 mt-10">
                {[
                  { href: "https://github.com/emmanuelbezerradev", icon: Github, color: "#00f0ff", label: "GitHub" },
                  { href: "https://instagram.com/emmanuelbezerra_", icon: Instagram, color: "#ff00ff", label: "Instagram" },
                  { href: "mailto:emmanuelbezerra1992@gmail.com", icon: Mail, color: "#00ff41", label: "Email" },
                ].map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1e1e2e] text-[#6b6b80] hover:border-[color:var(--c)] hover:text-[color:var(--c)] hover:shadow-[0_0_15px_var(--glow)] transition-all duration-300"
                    style={
                      {
                        "--c": s.color,
                        "--glow": `${s.color}30`,
                      } as React.CSSProperties
                    }
                  >
                    <s.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — Photo (sem fundo) com efeito neon */}
          <Reveal delay={0.4} direction="scale" className="hidden lg:block">
            <div className="relative flex justify-center">
              {/* Glow ring behind photo */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 60px rgba(0,240,255,0.15), 0 0 120px rgba(0,240,255,0.05)",
                    "0 0 80px rgba(255,0,255,0.2), 0 0 160px rgba(255,0,255,0.05)",
                    "0 0 60px rgba(0,240,255,0.15), 0 0 120px rgba(0,240,255,0.05)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full"
                style={{ top: "5%", bottom: "5%", left: "10%", right: "10%" }}
              />

              {/* Bottom gradient glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-t from-[#00f0ff]/20 via-[#ff00ff]/10 to-transparent blur-[60px] rounded-full" />

              {/* The photo */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-[420px] h-[520px]"
              >
                <Image
                  src="/images/foto-semfundo.png"
                  alt="Emmanuel Bezerra"
                  fill
                  className="object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,240,255,0.25)]"
                  sizes="420px"
                  priority
                />
              </motion.div>

              {/* Floating tech badges around photo */}
              {[
                { text: "React", x: "-10%", y: "20%", color: "#61dafb", delay: 0 },
                { text: "Next.js", x: "85%", y: "15%", color: "#fff", delay: 1 },
                { text: "Node.js", x: "90%", y: "60%", color: "#339933", delay: 2 },
                { text: "Python", x: "-5%", y: "65%", color: "#3776ab", delay: 3 },
              ].map((badge) => (
                <motion.div
                  key={badge.text}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    delay: badge.delay * 0.5,
                    ease: "easeInOut",
                  }}
                  className="absolute glass-card px-3 py-1.5 rounded-lg text-xs font-mono font-semibold"
                  style={{
                    left: badge.x,
                    top: badge.y,
                    color: badge.color,
                    borderColor: `${badge.color}30`,
                  }}
                >
                  {badge.text}
                </motion.div>
              ))}
            </div>
          </Reveal>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono text-[#6b6b80] uppercase tracking-widest">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 text-[#00f0ff]/60" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ABOUT — Parallax Photo + Cinematic Text
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="sobre"
        ref={aboutRef}
        className="relative py-32 overflow-hidden"
      >
        {/* Background effects */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Photo with parallax + decorative elements */}
            <Reveal direction="left">
              <div className="relative flex justify-center">
                {/* Main photo container */}
                <motion.div
                  style={{ y: photoY, rotate: photoRotate }}
                  className="relative"
                >
                  {/* Neon border frame */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#00f0ff]/30 via-transparent to-[#ff00ff]/30 blur-sm" />

                  <div className="relative w-80 h-96 rounded-2xl overflow-hidden border border-[#00f0ff]/15">
                    <Image
                      src="/images/foto-perfil.png"
                      alt="Emmanuel Bezerra"
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 scanlines opacity-15" />
                  </div>
                </motion.div>

                {/* Decorative geometry */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  className="absolute -top-8 -right-8 w-24 h-24 border border-[#00f0ff]/10 rounded-xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute -bottom-6 -left-6 w-20 h-20 border border-[#ff00ff]/10 rounded-full"
                />

                {/* Experience badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -right-4 top-1/4 glass-card rounded-xl px-4 py-3 text-center"
                >
                  <div className="text-2xl font-black neon-text-cyan">3+</div>
                  <div className="text-[10px] text-[#6b6b80] uppercase tracking-wider font-mono">
                    Anos XP
                  </div>
                </motion.div>

                {/* Projects badge */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute -left-4 bottom-1/4 glass-card rounded-xl px-4 py-3 text-center"
                >
                  <div className="text-2xl font-black neon-text-magenta">15+</div>
                  <div className="text-[10px] text-[#6b6b80] uppercase tracking-wider font-mono">
                    Projetos
                  </div>
                </motion.div>
              </div>
            </Reveal>

            {/* Text */}
            <Reveal direction="right" delay={0.2}>
              <div>
                {/* Section label */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-[#00f0ff] to-transparent" />
                  <span className="text-sm font-mono text-[#00f0ff] uppercase tracking-[0.2em]">
                    Sobre mim
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                  Código limpo.
                  <br />
                  <span className="gradient-text-cyber">Alta performance.</span>
                  <br />
                  <span className="text-[#6b6b80]">Resultados reais.</span>
                </h2>

                <div className="space-y-5 text-[#9999ab] leading-relaxed text-lg">
                  <p>
                    Sou desenvolvedor Full-Stack focado em{" "}
                    <span className="text-white font-medium">aplicações web modernas</span>{" "}
                    e escaláveis. Cada projeto é uma oportunidade de entregar
                    excelência técnica e impacto real.
                  </p>
                  <p>
                    Do{" "}
                    <span className="text-[#00f0ff]">frontend</span>{" "}
                    com React/Next.js ao{" "}
                    <span className="text-[#ff00ff]">backend</span>{" "}
                    com Node.js e Python — domino toda a stack.
                    Bancos SQL, APIs robustas, Docker, CI/CD e deploy em cloud.
                  </p>
                  <p>
                    Baseado em{" "}
                    <span className="text-white font-medium">Fortaleza - CE</span>,
                    atendo clientes de todo o Brasil com projetos que
                    vão de landing pages a plataformas SaaS completas.
                  </p>
                </div>

                {/* Stats row with animated counters */}
                <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-[#1e1e2e]">
                  {[
                    { value: 3, suffix: "+", label: "Anos de\nexperiência", color: "#00f0ff" },
                    { value: 15, suffix: "+", label: "Projetos\nentregues", color: "#ff00ff" },
                    { value: 100, suffix: "%", label: "Clientes\nsatisfeitos", color: "#00ff41" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div
                        className="text-3xl sm:text-4xl font-black"
                        style={{
                          color: stat.color,
                          textShadow: `0 0 20px ${stat.color}40`,
                        }}
                      >
                        <Counter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-xs text-[#6b6b80] mt-2 whitespace-pre-line font-mono uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TECH STACK — Interactive 3D Cards
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="stack" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f0ff]/[0.015] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Header */}
          <Reveal>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00f0ff]" />
                <span className="text-sm font-mono text-[#00f0ff] uppercase tracking-[0.2em]">
                  Habilidades
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#00f0ff]" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Minha{" "}
                <span className="gradient-text-cyber">Tech Stack</span>
              </h2>
            </div>
          </Reveal>

          {/* Service pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: <Code2 className="h-7 w-7" />,
                title: "Frontend",
                desc: "React, Next.js, TypeScript, Tailwind CSS, Framer Motion. Interfaces responsivas, acessíveis e com animações cinematográficas.",
                color: "#00f0ff",
                items: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
              },
              {
                icon: <Server className="h-7 w-7" />,
                title: "Backend",
                desc: "Node.js, Python, APIs REST & GraphQL, PostgreSQL, Prisma ORM. Arquitetura limpa, segura e performática.",
                color: "#ff00ff",
                items: ["Node.js / Express", "Python / FastAPI", "PostgreSQL / Prisma", "Redis / Queue"],
              },
              {
                icon: <Layers className="h-7 w-7" />,
                title: "DevOps & Cloud",
                desc: "Docker, CI/CD, Linux, AWS, Vercel, Nginx. Infra automatizada do dev ao production.",
                color: "#00ff41",
                items: ["Docker / Compose", "GitHub Actions", "AWS / Vercel", "Nginx / SSL"],
              },
            ].map((service, i) => (
              <Reveal key={service.title} delay={i * 0.15} direction="scale">
                <TiltCard className="h-full">
                  <div className="glass-card rounded-2xl p-8 h-full relative overflow-hidden group">
                    {/* Subtle glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${service.color}08 0%, transparent 70%)`,
                      }}
                    />

                    <div className="relative z-10">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl mb-6"
                        style={{
                          background: `${service.color}10`,
                          border: `1px solid ${service.color}25`,
                          color: service.color,
                          boxShadow: `0 0 20px ${service.color}10`,
                        }}
                      >
                        {service.icon}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">
                        {service.title}
                      </h3>

                      <p className="text-sm text-[#6b6b80] leading-relaxed mb-6">
                        {service.desc}
                      </p>

                      {/* Bullet list */}
                      <ul className="space-y-2">
                        {service.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: service.color }}
                            />
                            <span className="text-[#9999ab]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* Tech grid with skill bars - CLICÁVEL */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStack.map((tech, i) => {
              const catColors: Record<string, string> = {
                Frontend: "#00f0ff",
                Backend: "#ff00ff",
                DevOps: "#00ff41",
              };
              const color = catColors[tech.cat] || "#00f0ff";
              
              return (
                <Reveal key={tech.name} delay={i * 0.04}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setSelectedTech(tech)}
                    className="glass-card rounded-xl p-4 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Hover glow effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${color}15 0%, transparent 70%)`,
                      }}
                    />
                    
                    {/* Click indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                    </motion.div>
                    
                    <div className="relative z-10 flex items-center gap-3 mb-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{tech.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-[#00f0ff] transition-colors">
                          {tech.name}
                        </div>
                        <div className="text-[10px] text-[#6b6b80] font-mono">
                          {tech.cat}
                        </div>
                      </div>
                    </div>
                    
                    {/* Skill bar */}
                    <div className="relative z-10 h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${color}, ${color}aa)`,
                        }}
                      />
                    </div>
                    
                    {/* Hint text */}
                    <div className="relative z-10 mt-2 text-[9px] text-[#6b6b80] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      Clique para saber mais
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PROJECTS — Cinematic Showcase
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="projetos" className="relative py-32">
        <div className="absolute inset-0 cyber-grid opacity-15" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Header */}
          <Reveal>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#ff00ff]" />
                <span className="text-sm font-mono text-[#ff00ff] uppercase tracking-[0.2em]">
                  Portfólio
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#ff00ff]" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Projetos em{" "}
                <span className="neon-text-magenta">destaque</span>
              </h2>
            </div>
          </Reveal>

          {/* Projects */}
          <div className="space-y-32">
            {projects.map((project, i) => (
              <Reveal key={project.title} direction={i % 2 === 0 ? "left" : "right"}>
                <div className={`grid lg:grid-cols-12 gap-8 items-center`}>
                  {/* Image area */}
                  <div
                    className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <ImageReveal direction={i % 2 === 0 ? "left" : "right"}>
                      <TiltCard>
                        <div
                          className="relative aspect-[16/10] rounded-2xl overflow-hidden border group cursor-pointer"
                          style={{ borderColor: `${project.color}15` }}
                        >
                          {/* Screenshot do projeto */}
                          <motion.div
                            className="relative w-full h-full"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.7 }}
                          >
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover object-top"
                              sizes="(max-width: 768px) 100vw, 58vw"
                            />
                          </motion.div>

                          {/* Overlay gradiente sutil */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/20 pointer-events-none" />
                          <div className="absolute inset-0 scanlines opacity-8 pointer-events-none" />

                          {/* Large number overlay */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="absolute top-4 left-5 z-10 pointer-events-none"
                          >
                            <span
                              className="text-7xl font-black opacity-[0.12] leading-none"
                              style={{ color: project.color }}
                            >
                              {project.number}
                            </span>
                          </motion.div>

                        {/* Neon border glow on hover */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            boxShadow: `inset 0 0 30px ${project.color}15, 0 0 40px ${project.color}10`,
                          }}
                        />

                        {/* Hover overlay — clicável para visitar */}
                        <a
                          href={project.link !== "#" ? project.link : undefined}
                          target={project.link !== "#" ? "_blank" : undefined}
                          rel={project.link !== "#" ? "noopener noreferrer" : undefined}
                          className="absolute inset-0 z-20 bg-[#0a0a0f]/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]"
                        >
                          <div className="text-center">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              className="flex h-16 w-16 items-center justify-center mx-auto rounded-2xl border-2 mb-3"
                              style={{
                                borderColor: project.color,
                                background: `${project.color}15`,
                                boxShadow: `0 0 30px ${project.color}30`,
                              }}
                            >
                              <ExternalLink className="h-6 w-6" style={{ color: project.color }} />
                            </motion.div>
                          <span
                              className="text-sm font-mono font-bold tracking-wider uppercase"
                              style={{ color: project.color }}
                            >
                              {project.link !== "#" ? "Visitar Site" : "Ver Projeto"}
                            </span>
                          </div>
                        </a>
                      </div>
                    </TiltCard>
                    </ImageReveal>
                  </div>

                  {/* Info area */}
                  <div
                    className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1 lg:text-right" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-3" style={{ justifyContent: i % 2 === 1 ? "flex-end" : "flex-start" }}>
                      <Zap className="h-4 w-4" style={{ color: project.color }} />
                      <span
                        className="text-sm font-mono uppercase tracking-[0.15em]"
                        style={{ color: project.color }}
                      >
                        {project.subtitle}
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
                      {project.title}
                    </h3>

                    {/* Description card */}
                    <div className="glass-card rounded-xl p-6 mb-6">
                      <p className="text-[#9999ab] leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div
                      className="flex flex-wrap gap-2 mb-6"
                      style={{ justifyContent: i % 2 === 1 ? "flex-end" : "flex-start" }}
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 text-xs font-mono rounded-lg border transition-all duration-300 hover:scale-105"
                          style={{
                            color: project.color,
                            borderColor: `${project.color}25`,
                            background: `${project.color}08`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Link */}
                    {project.link !== "#" && (
                      <MagneticButton
                        href={project.link}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm font-bold transition-all"
                      >
                        <span style={{ color: project.color }}>
                          Visitar projeto
                        </span>
                        <ExternalLink className="h-4 w-4" style={{ color: project.color }} />
                      </MagneticButton>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS — Client Reviews
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="depoimentos" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff00ff]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <Reveal>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff00ff]/20 bg-[#ff00ff]/5 mb-6">
                <span className="text-sm font-mono text-[#ff00ff]">
                  {"<Testimonials />"}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                O que dizem meus{" "}
                <span className="gradient-text-cyber">clientes</span>
              </h2>
              <p className="text-[#6b6b80] text-lg max-w-2xl mx-auto">
                Feedback de pessoas incríveis com quem tive o prazer de colaborar
              </p>
            </div>
          </Reveal>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Mykaele Procópio",
                role: "Proprietária — Myka Procópio Clínica",
                text: "Emmanuel desenvolveu um site incrível para minha clínica! O sistema de agendamento online transformou nosso atendimento. Profissional, pontual e criativo.",
                avatar: "MP",
                color: "#00f0ff",
                stars: 5,
              },
              {
                name: "Lucas Oliveira",
                role: "CEO — StartupTech",
                text: "Trabalho excepcional! Entregou a plataforma antes do prazo com qualidade impecável. A dashboard administrativa superou todas as expectativas.",
                avatar: "LO",
                color: "#ff00ff",
                stars: 5,
              },
              {
                name: "Amanda Silva",
                role: "Marketing — E-commerce Fashion",
                text: "O e-commerce que Emmanuel criou aumentou nossas vendas em 150%. Interface linda, rápida e com ótima experiência mobile. Recomendo!",
                avatar: "AS",
                color: "#00ff41",
                stars: 5,
              },
              {
                name: "Ricardo Santos",
                role: "Gerente — Consultoria Financeira",
                text: "Sistema de gestão robusto e intuitivo. A integração com APIs bancárias foi perfeita. Comunicação clara durante todo o projeto.",
                avatar: "RS",
                color: "#00f0ff",
                stars: 5,
              },
              {
                name: "Beatriz Costa",
                role: "Proprietária — Studio de Design",
                text: "Meu portfólio ficou simplesmente maravilhoso! As animações e efeitos dão uma identidade única. Recebi muitos elogios dos clientes.",
                avatar: "BC",
                color: "#ff00ff",
                stars: 5,
              },
              {
                name: "Fernando Mendes",
                role: "CTO — Logística Express",
                text: "O app de rastreamento que desenvolveu revolucionou nossa operação. Performance incrível mesmo com milhares de usuários simultâneos.",
                avatar: "FM",
                color: "#00ff41",
                stars: 5,
              },
            ].map((testimonial, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card p-8 rounded-2xl border border-[#1e1e2e] hover:border-[color:var(--hover-color)]/30 transition-all duration-500 h-full flex flex-col"
                  style={{ "--hover-color": testimonial.color } as React.CSSProperties}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.stars }).map((_, si) => (
                      <motion.span
                        key={si}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + si * 0.1 }}
                        className="text-yellow-400"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[#9999ab] leading-relaxed flex-1 mb-6">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[#1e1e2e]">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{
                        background: `${testimonial.color}20`,
                        color: testimonial.color,
                        border: `2px solid ${testimonial.color}30`,
                      }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-sm text-[#6b6b80]">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ — Frequently Asked Questions
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff41]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff41]/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff41]/20 bg-[#00ff41]/5 mb-6">
                <span className="text-sm font-mono text-[#00ff41]">
                  {"<FAQ />"}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Perguntas{" "}
                <span className="gradient-text-cyber">frequentes</span>
              </h2>
              <p className="text-[#6b6b80] text-lg">
                Dúvidas comuns sobre meus serviços e processo de trabalho
              </p>
            </div>
          </Reveal>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {[
              {
                q: "Qual é o prazo médio de entrega de um projeto?",
                a: "Depende da complexidade: Landing pages de 1-2 semanas, sites institucionais de 2-4 semanas, e-commerces ou apps de 4-8 semanas. Sempre defino prazos realistas após entender seu projeto.",
                color: "#00f0ff",
              },
              {
                q: "Como funciona o processo de desenvolvimento?",
                a: "1) Briefing e análise de requisitos, 2) Proposta e orçamento, 3) Wireframes e aprovação do design, 4) Desenvolvimento com atualizações semanais, 5) Testes e ajustes, 6) Deploy e entrega com documentação.",
                color: "#ff00ff",
              },
              {
                q: "Você oferece suporte após a entrega?",
                a: "Sim! Ofereço 30 dias de suporte gratuito para correção de bugs. Também tenho planos de manutenção mensal para atualizações, novas features e suporte técnico contínuo.",
                color: "#00ff41",
              },
              {
                q: "Quais formas de pagamento você aceita?",
                a: "Aceito PIX, transferência bancária e cartão de crédito (via Mercado Pago). Para projetos maiores, trabalho com pagamento em etapas: entrada + parcelas no desenvolvimento + saldo na entrega.",
                color: "#00f0ff",
              },
              {
                q: "Você desenvolve para mobile também?",
                a: "Sim! Desenvolvo apps mobile com React Native (iOS e Android) e também PWAs (Progressive Web Apps) que funcionam como apps instaláveis diretamente do navegador.",
                color: "#ff00ff",
              },
              {
                q: "O site fica responsivo em todos os dispositivos?",
                a: "Com certeza! Todos os meus projetos são desenvolvidos com mobile-first, garantindo perfeito funcionamento em celulares, tablets, laptops e desktops de qualquer tamanho.",
                color: "#00ff41",
              },
            ].map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={0.4}>
            <div className="text-center mt-12">
              <p className="text-[#6b6b80] mb-4">Não encontrou sua dúvida?</p>
              <a
                href="#contato"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black bg-[#00f0ff] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-500"
              >
                <Mail className="h-4 w-4" />
                Entre em contato
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTACT — Premium CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="contato" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f0ff]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff41]/20 to-transparent" />
        <Particles />

        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-12">
          {/* Header */}
          <Reveal>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00ff41]" />
                <span className="text-sm font-mono text-[#00ff41] uppercase tracking-[0.2em]">
                  Contato
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#00ff41]" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Vamos construir algo
                <br />
                <span className="neon-text-green">incrível juntos</span>?
              </h2>
              <p className="text-[#6b6b80] max-w-xl mx-auto text-lg">
                Tem um projeto em mente? Estou disponível para freelance,
                parcerias e novos desafios.
              </p>
            </div>
          </Reveal>

          {/* Contact cards */}
          <Reveal delay={0.2}>
            <div className="grid sm:grid-cols-3 gap-5 mb-16">
              {[
                {
                  href: "https://wa.me/5585998500344",
                  icon: Phone,
                  title: "WhatsApp",
                  value: "(85) 99850-0344",
                  color: "#00ff41",
                  external: true,
                },
                {
                  href: "mailto:emmanuelbezerra1992@gmail.com",
                  icon: Mail,
                  title: "Email",
                  value: "emmanuelbezerra1992@gmail.com",
                  color: "#00f0ff",
                  external: false,
                },
                {
                  href: "https://github.com/emmanuelbezerradev",
                  icon: Github,
                  title: "GitHub",
                  value: "@emmanuelbezerradev",
                  color: "#ff00ff",
                  external: true,
                },
              ].map((card) => (
                <motion.a
                  key={card.title}
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card rounded-2xl p-6 text-center group relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${card.color}08 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `${card.color}10`,
                        border: `1px solid ${card.color}20`,
                        color: card.color,
                      }}
                    >
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-bold text-white mb-1">
                      {card.title}
                    </div>
                    <div className="text-xs text-[#6b6b80] break-all">
                      {card.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </Reveal>

          {/* Big CTA button */}
          <Reveal delay={0.4}>
            <div className="text-center">
              <MagneticButton
                href="https://wa.me/5585998500344?text=Ol%C3%A1%20Emmanuel!%20Vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto."
                target="_blank"
                className="group inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-lg text-black bg-[#00f0ff] hover:shadow-[0_0_60px_rgba(0,240,255,0.4)] transition-all duration-500 relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Send className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Iniciar Conversa</span>
              </MagneticButton>

              <p className="text-xs text-[#6b6b80] mt-6 flex items-center justify-center gap-2 font-mono">
                <MapPin className="h-3 w-3 text-[#00f0ff]/50" />
                Fortaleza - CE, Brasil
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tech Modal */}
      <TechModal tech={selectedTech} onClose={() => setSelectedTech(null)} />
    </>
  );
}
