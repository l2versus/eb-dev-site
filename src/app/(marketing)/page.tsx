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
  Shield,
  Clock,
  Calendar,
  Download,
  CheckCircle,
  Award,
  Users,
  TrendingUp,
  Star,
  BadgeCheck,
  Timer,
  Rocket,
  Target,
  Headphones,
  Lock,
  RefreshCw,
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
    title: "Ricardo Rautenberg",
    subtitle: "Imóveis de Luxo — SP",
    description:
      "Portfólio digital premium para corretor de alto padrão em São Paulo e ABC Paulista — listagem de imóveis com filtros avançados, modo off-market (sigiloso), painel admin completo, integração WhatsApp e SEO otimizado para Google.",
    tags: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"],
    link: "https://ricardorautenberg.com.br",
    image: "/images/project-ricardo.png",
    color: "#d4af37",
    number: "01",
    metrics: [
      { label: "Alto Padrão", value: "ABC+SP", icon: "🏙️" },
      { label: "Off-Market", value: "Exclusivo", icon: "🔐" },
      { label: "Performance", value: "<1s", icon: "⚡" },
    ],
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
    metrics: [
      { label: "Clientes", value: "+150%", icon: "📈" },
      { label: "Load Time", value: "<1s", icon: "🚀" },
      { label: "Economia", value: "R$2k/mês", icon: "💎" },
    ],
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

  // ─── Notificar visita via WhatsApp ───────────────────────────────────────────
  useEffect(() => {
    const notifyVisit = async () => {
      try {
        // Obter localização aproximada via API gratuita
        let city = "";
        let country = "";
        try {
          const geoRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
          if (geoRes.ok) {
            const geo = await geoRes.json();
            city = geo.city || "";
            country = geo.country_name || "";
          }
        } catch {
          // Ignorar erro de geolocalização
        }

        await fetch("/api/visitor-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: "Home - Portfolio",
            referrer: document.referrer || "Direto",
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            city,
            country,
          }),
        });
      } catch {
        // Silently fail - não atrapalha o usuário
      }
    };

    // Pequeno delay para não impactar carregamento
    const timer = setTimeout(notifyVisit, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Cinematic Full-Screen
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 lg:pt-20"
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
            {/* Status badges */}
            <Reveal delay={0.1}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-6 sm:mb-8">
                {/* Available badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5">
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-[#00ff41]"
                  />
                  <span className="text-sm font-mono text-[#6b6b80]">
                    Disponível para projetos
                  </span>
                </div>
                
                {/* Verified badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff00ff]/20 bg-[#ff00ff]/5">
                  <BadgeCheck className="w-4 h-4 text-[#ff00ff]" />
                  <span className="text-sm font-mono text-[#ff00ff]">
                    Verified Developer
                  </span>
                </div>
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-2 leading-[0.95]">
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
              <p className="text-[#6b6b80] max-w-sm sm:max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed text-base sm:text-lg px-2 sm:px-0">
                Crio aplicações web de alta performance com código
                limpo, arquitetura escalável e design que converte.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.7}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <MagneticButton
                  href="#projetos"
                  className="group inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-black bg-[#00f0ff] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-500 text-sm sm:text-base"
                >
                  <Sparkles className="h-4 w-4" />
                  Ver Projetos
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>

                <Link
                  href="/orcamento"
                  className="group inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-black bg-[#00ff41] hover:shadow-[0_0_40px_rgba(0,255,65,0.5)] transition-all duration-500 text-sm sm:text-base"
                >
                  <FileText className="h-4 w-4" />
                  Orçamento
                </Link>

                <MagneticButton
                  href="#contato"
                  className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold border border-[#1e1e2e] text-white hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/5 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all duration-500 text-sm sm:text-base"
                >
                  Fale Comigo
                </MagneticButton>
              </div>
            </Reveal>

            {/* Social icons */}
            <Reveal delay={0.9}>
              <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-5 mt-6 sm:mt-10">
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
          VIDEO INTRO — Meet Me Section
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff00ff]/20 bg-[#ff00ff]/5 mb-6">
                <span className="text-sm font-mono text-[#ff00ff]">
                  {"<MeetTheCreator />"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Conheça quem está por trás do{" "}
                <span className="gradient-text-cyber">código</span>
              </h2>
              <p className="text-[#6b6b80] max-w-xl mx-auto">
                2 minutos para você entender como posso ajudar seu negócio
              </p>
            </div>
          </Reveal>

          {/* Video Container */}
          <Reveal delay={0.2}>
            <div className="relative rounded-3xl overflow-hidden border border-[#1e1e2e] glass-card">
              <div className="aspect-video bg-[#0a0a0f] relative group">
                <video
                  id="hero-video"
                  className="w-full h-full object-cover"
                  src="/videos/video-app.mp4#t=0.5"
                  playsInline
                  preload="auto"
                  controls={false}
                  onClick={(e) => {
                    const v = e.currentTarget;
                    const overlay = document.getElementById("video-play-overlay");
                    if (v.paused) {
                      v.controls = true;
                      v.play();
                      if (overlay) overlay.style.display = "none";
                    }
                  }}
                />

                {/* Custom Play Overlay — clique para iniciar */}
                <div
                  id="video-play-overlay"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                  onClick={() => {
                    const v = document.getElementById("hero-video") as HTMLVideoElement;
                    if (v) {
                      v.currentTime = 0;
                      v.controls = true;
                      v.play();
                      const overlay = document.getElementById("video-play-overlay");
                      if (overlay) overlay.style.display = "none";
                    }
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#ff00ff] blur-xl opacity-40 animate-pulse" />
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#ff44ff] flex items-center justify-center shadow-lg shadow-[#ff00ff]/30 hover:scale-110 transition-transform">
                      <svg className="h-7 w-7 sm:h-8 sm:w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#00f0ff]/50 pointer-events-none z-20" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#00f0ff]/50 pointer-events-none z-20" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#ff00ff]/50 pointer-events-none z-20" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#ff00ff]/50 pointer-events-none z-20" />
              </div>
            </div>
          </Reveal>

          {/* Video features */}
          <Reveal delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
              {[
                { icon: "🎯", text: "Minha abordagem" },
                { icon: "💡", text: "Como resolvo problemas" },
                { icon: "🚀", text: "Resultados reais" },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 sm:p-4 rounded-xl glass-card">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <span className="text-sm text-[#6b6b80]">{item.text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CASE STUDY — Featured Project Deep Dive
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="case-study" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff41]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff41]/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff41]/20 bg-[#00ff41]/5 mb-6">
                <Award className="w-4 h-4 text-[#00ff41]" />
                <span className="text-sm font-mono text-[#00ff41]">
                  Case Study em Destaque
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                De conceito a{" "}
                <span className="neon-text-green">+150% de clientes</span>
              </h2>
              <p className="text-[#6b6b80] text-lg max-w-2xl mx-auto">
                Veja como transformei a presença digital de uma clínica de estética
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup/Screenshot */}
            <Reveal direction="left">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden border border-[#00ff41]/20 shadow-[0_0_60px_rgba(0,255,65,0.1)]">
                  <Image
                    src="/images/project-estetica.png"
                    alt="Myka Procópio Case Study"
                    width={600}
                    height={400}
                    className="w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
                  
                  {/* Floating metrics */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute top-4 right-4 glass-card rounded-xl px-4 py-3"
                  >
                    <div className="text-2xl font-black text-[#00ff41]">+150%</div>
                    <div className="text-xs text-[#6b6b80]">Novos Clientes</div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute bottom-4 left-4 glass-card rounded-xl px-4 py-3"
                  >
                    <div className="text-2xl font-black text-[#00f0ff]">0.8s</div>
                    <div className="text-xs text-[#6b6b80]">Load Time</div>
                  </motion.div>
                </div>
              </div>
            </Reveal>

            {/* Details */}
            <Reveal direction="right" delay={0.2}>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Myka Procópio Clínica</h3>
                <p className="text-[#ff00ff] font-mono text-sm mb-6">Sistema SaaS Completo</p>
                
                {/* Problem/Solution */}
                <div className="space-y-6 mb-8">
                  <div className="glass-card rounded-xl p-6 border-l-4 border-[#ff00ff]">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="text-[#ff00ff]">❌</span> O Problema
                    </h4>
                    <p className="text-[#9999ab] text-sm">
                      Agendamentos via WhatsApp, controle financeiro em planilha, sem presença digital profissional. Clínica perdia clientes para concorrentes com sites modernos.
                    </p>
                  </div>
                  
                  <div className="glass-card rounded-xl p-6 border-l-4 border-[#00ff41]">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="text-[#00ff41]">✅</span> A Solução
                    </h4>
                    <p className="text-[#9999ab] text-sm">
                      Sistema completo: site institucional + agendamento online + dashboard financeiro + chatbot IA + notificações WhatsApp automatizadas.
                    </p>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { metric: "+150%", label: "Novos clientes/mês", color: "#00ff41" },
                    { metric: "60%", label: "Menos no-shows", color: "#00f0ff" },
                    { metric: "R$2k", label: "Economia mensal", color: "#ff00ff" },
                    { metric: "4.9★", label: "Avaliação Google", color: "#ffaa00" },
                  ].map((item, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 text-center">
                      <div 
                        className="text-2xl font-black"
                        style={{ color: item.color, textShadow: `0 0 20px ${item.color}40` }}
                      >
                        {item.metric}
                      </div>
                      <div className="text-xs text-[#6b6b80]">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech stack used */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Next.js", "TypeScript", "Prisma", "Mercado Pago", "Tailwind", "AI"].map((tech) => (
                    <span key={tech} className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 text-[#9999ab] border border-[#1e1e2e]">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="https://www.mykaprocopio.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#00ff41] hover:underline font-bold"
                >
                  Ver projeto ao vivo
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VIDEO SHOWCASE — Demonstrações de Projetos
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="videos" className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d15] to-[#08080d]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff00ff]/20 bg-[#ff00ff]/5 mb-6">
                <svg className="w-4 h-4 text-[#ff00ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                <span className="text-sm font-mono text-[#ff00ff]">
                  {"<VideoShowcase />"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Veja os projetos{" "}
                <span className="gradient-text-cyber">em ação</span>
              </h2>
              <p className="text-[#6b6b80] max-w-xl mx-auto">
                Demonstrações reais de projetos entregues — navegação, animações e funcionalidades
              </p>
            </div>
          </Reveal>

          {/* Video Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "App Myka Procópio",
                desc: "Aplicativo de estética com agendamento e acompanhamento de sessões",
                src: "/videos/video-app.mp4",
                poster: "/images/project-estetica.png",
                color: "#ff00ff",
                tag: "App Mobile",
              },
              {
                title: "Myka Procópio — Detalhes",
                desc: "Fluxo completo de agendamento e galeria de resultados",
                src: "/videos/video-app.mp4",
                poster: "/images/project-estetica.png",
                color: "#00f0ff",
                tag: "UX/UI",
              },
              {
                title: "Myka Procópio — Admin",
                desc: "Painel administrativo com gestão de clientes e financeiro",
                src: "/videos/video-app.mp4",
                poster: "/images/project-estetica.png",
                color: "#00ff41",
                tag: "Dashboard",
              },
            ].map((video, i) => (
              <Reveal key={video.title} delay={i * 0.1}>
                <div className="group relative rounded-2xl overflow-hidden border border-[#1e1e2e] bg-[#0f0f18] hover:border-[#ff00ff]/30 transition-all duration-500">
                  {/* Video Player */}
                  <div className="aspect-video relative bg-black">
                    <video
                      className="w-full h-full object-cover"
                      src={video.src}
                      poster={video.poster}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                      onTouchStart={(e) => {
                        const v = e.target as HTMLVideoElement;
                        if (v.paused) v.play(); else { v.pause(); v.currentTime = 0; }
                      }}
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: video.color, boxShadow: `0 0 30px ${video.color}40` }}
                      >
                        <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    {/* Tag */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider glass" style={{ color: video.color }}>
                      {video.tag}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#ff00ff] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-[#6b6b80] line-clamp-2">{video.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Hint */}
          <Reveal delay={0.4}>
            <p className="text-center text-xs text-[#6b6b80] mt-8">
              Passe o mouse (ou toque) nos vídeos para assistir · Mais projetos em breve
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          GOOGLE REVIEWS — Social Proof
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#08080d]" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-2xl font-bold text-white">4.9</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[#6b6b80] text-sm">
                Avaliação média no Google • 15+ reviews
              </p>
            </div>
          </Reveal>

          {/* Reviews carousel */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Mykaele P.",
                avatar: "MP",
                rating: 5,
                text: "Profissional excepcional! Meu site ficou muito além do esperado. Comunicação clara e entrega antes do prazo. Super recomendo!",
                date: "há 2 semanas",
              },
              {
                name: "Lucas O.",
                avatar: "LO",
                rating: 5,
                text: "Emmanuel transformou nossa ideia em realidade. O sistema que ele desenvolveu aumentou nossa produtividade em 200%. Trabalho impecável!",
                date: "há 1 mês",
              },
              {
                name: "Amanda S.",
                avatar: "AS",
                rating: 5,
                text: "Incrível atenção aos detalhes! O e-commerce que ele criou já faturou R$50k no primeiro mês. Investimento que se pagou rápido.",
                date: "há 1 mês",
              },
            ].map((review, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 h-full border border-[#1e1e2e]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#ff00ff] flex items-center justify-center text-sm font-bold text-white">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{review.name}</p>
                        <p className="text-xs text-[#6b6b80]">{review.date}</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    </svg>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(review.rating)].map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  
                  {/* Text */}
                  <p className="text-[#9999ab] text-sm leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-8">
              <a
                href="https://g.page/r/emmanuelbezerradev/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#00f0ff] hover:underline"
              >
                Ver todas as avaliações no Google
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ABOUT — Parallax Photo + Cinematic Text
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="sobre"
        ref={aboutRef}
        className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
      >
        {/* Background effects */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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

                {/* Decorative floating code snippet */}
                <motion.div
                  animate={{ rotate: [0, 3, -3, 0], y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute -top-6 right-0 lg:-right-6 glass-card rounded-xl px-3 py-2 border border-[#00f0ff]/20 backdrop-blur-md hidden sm:block"
                >
                  <pre className="text-[10px] font-mono text-[#00f0ff]/70 leading-relaxed">
                    <span className="text-[#ff00ff]/60">const</span> dev = {'{'}<br/>
                    &nbsp;&nbsp;stack: <span className="text-[#00ff41]/70">&apos;fullstack&apos;</span>,<br/>
                    &nbsp;&nbsp;passion: <span className="text-[#00f0ff]">∞</span><br/>
                    {'}'};
                  </pre>
                </motion.div>

                {/* Decorative glowing orb */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 w-16 h-16 rounded-full hidden sm:block"
                  style={{
                    background: "radial-gradient(circle, rgba(255,0,255,0.3) 0%, transparent 70%)",
                    boxShadow: "0 0 40px rgba(255,0,255,0.15)",
                  }}
                />

                {/* Experience badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute right-0 sm:-right-4 top-1/4 glass-card rounded-xl px-4 py-3 text-center"
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
                  className="absolute left-0 sm:-left-4 bottom-1/4 glass-card rounded-xl px-4 py-3 text-center"
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
                  <motion.span
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    Código limpo.
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="block gradient-text-cyber"
                  >
                    Alta performance.
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-[#6b6b80]"
                  >
                    Resultados reais.
                  </motion.span>
                </h2>

                <div className="space-y-5 text-[#9999ab] leading-relaxed text-lg">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Sou desenvolvedor Full-Stack focado em{" "}
                    <span className="text-white font-medium">aplicações web modernas</span>{" "}
                    e escaláveis. Cada projeto é uma oportunidade de entregar
                    excelência técnica e impacto real.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                  >
                    Do{" "}
                    <span className="text-[#00f0ff]">frontend</span>{" "}
                    com React/Next.js ao{" "}
                    <span className="text-[#ff00ff]">backend</span>{" "}
                    com Node.js e Python — domino toda a stack.
                    Bancos SQL, APIs robustas, Docker, CI/CD e deploy em cloud.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Baseado em{" "}
                    <span className="text-white font-medium">Fortaleza - CE</span>,
                    atendo clientes de todo o Brasil com projetos que
                    vão de landing pages a plataformas SaaS completas.
                  </motion.p>
                </div>

                {/* Stats row with animated counters */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-px mt-10 bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent"
                />
                <div className="grid grid-cols-3 gap-6 pt-10">
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
      <section id="stack" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f0ff]/[0.015] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent" />

        {/* Floating decorative particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`stack-particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: i % 2 === 0 ? "#00f0ff" : "#ff00ff",
              boxShadow: `0 0 10px ${i % 2 === 0 ? "#00f0ff" : "#ff00ff"}60`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Header */}
          <Reveal>
            <div className="text-center mb-10 sm:mb-16 lg:mb-20">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 sm:mb-16 lg:mb-20">
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
      <section id="projetos" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-15" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />

        {/* Scroll-linked side accent lines */}
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "60%" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-4 top-[20%] w-px bg-gradient-to-b from-[#ff00ff]/40 via-[#00f0ff]/40 to-transparent hidden xl:block"
        />
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "60%" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-4 top-[20%] w-px bg-gradient-to-b from-[#00f0ff]/40 via-[#ff00ff]/40 to-transparent hidden xl:block"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          {/* Header */}
          <Reveal>
            <div className="text-center mb-10 sm:mb-16 lg:mb-20">
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
          <div className="space-y-16 sm:space-y-24 lg:space-y-32">
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

                    {/* Metrics */}
                    <div
                      className="flex flex-wrap gap-4 mb-6"
                      style={{ justifyContent: i % 2 === 1 ? "flex-end" : "flex-start" }}
                    >
                      {project.metrics.map((metric, mi) => (
                        <motion.div
                          key={mi}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: mi * 0.1 }}
                          className="glass-card px-4 py-3 rounded-xl border border-[#1e1e2e] hover:border-[color:var(--project-color)]/30 transition-all"
                          style={{ "--project-color": project.color } as React.CSSProperties}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{metric.icon}</span>
                            <div>
                              <div className="text-lg font-black" style={{ color: project.color }}>
                                {metric.value}
                              </div>
                              <div className="text-xs text-[#6b6b80] font-mono">
                                {metric.label}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
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
      <section id="depoimentos" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff00ff]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <Reveal>
            <div className="text-center mb-10 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff00ff]/20 bg-[#ff00ff]/5 mb-6">
                <span className="text-sm font-mono text-[#ff00ff]">
                  {"<Testimonials />"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
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
      <section id="faq" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
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
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
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
          CERTIFICATIONS — Skills & Badges
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="certificacoes" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f0ff]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-6">
                <span className="text-sm font-mono text-[#00f0ff]">
                  {"<Certifications />"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Certificações &{" "}
                <span className="gradient-text-cyber">Skills</span>
              </h2>
              <p className="text-[#6b6b80] text-lg max-w-2xl mx-auto">
                Aprendizado contínuo é a chave para entregar soluções de qualidade
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "React.js", provider: "Meta", year: "2023", icon: "⚛️", color: "#00f0ff" },
              { name: "Node.js", provider: "OpenJS", year: "2023", icon: "🟢", color: "#00ff41" },
              { name: "TypeScript", provider: "Microsoft", year: "2024", icon: "📘", color: "#3178c6" },
              { name: "AWS Cloud", provider: "Amazon", year: "2024", icon: "☁️", color: "#ff9900" },
              { name: "Docker", provider: "Docker Inc", year: "2023", icon: "🐳", color: "#2496ed" },
              { name: "PostgreSQL", provider: "EDB", year: "2023", icon: "🐘", color: "#336791" },
              { name: "Next.js", provider: "Vercel", year: "2024", icon: "▲", color: "#ffffff" },
              { name: "Python", provider: "PSF", year: "2023", icon: "🐍", color: "#ffd43b" },
            ].map((cert, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card p-6 rounded-xl border border-[#1e1e2e] hover:border-[color:var(--cert-color)]/30 transition-all duration-300"
                  style={{ "--cert-color": cert.color } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{cert.icon}</span>
                    <span className="text-xs font-mono px-2 py-1 rounded-full bg-white/5 text-[#6b6b80]">
                      {cert.year}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1">{cert.name}</h3>
                  <p className="text-sm text-[#6b6b80]">{cert.provider}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BLOG — Video Showcase
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="blog" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff00ff]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff00ff]/20 bg-[#ff00ff]/5 mb-6">
                <span className="text-sm font-mono text-[#ff00ff]">
                  {"<Demo />"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Veja em{" "}
                <span className="gradient-text-cyber">Ação</span>
              </h2>
              <p className="text-[#6b6b80] text-lg max-w-2xl mx-auto">
                Uma demonstração real do tipo de aplicação que eu desenvolvo
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative group">
              {/* Glow border */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#00f0ff]/20 via-[#ff00ff]/20 to-[#00ff41]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1e1e2e] group-hover:border-[#ff00ff]/30 transition-all duration-500">
                <video
                  className="w-full aspect-video object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster=""
                >
                  <source src="/videos/Next.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeos HTML5.
                </video>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12">
              <div className="flex items-center gap-2 text-sm text-[#6b6b80]">
                <div className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                Design Responsivo
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6b6b80]">
                <div className="w-2 h-2 rounded-full bg-[#ff00ff]" />
                Animações Fluidas
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6b6b80]">
                <div className="w-2 h-2 rounded-full bg-[#00ff41]" />
                Alta Performance
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NEWSLETTER — Subscribe CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="newsletter" className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff41]/[0.02] to-transparent" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="glass-card rounded-3xl p-10 lg:p-16 border border-[#00ff41]/20 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff41] rounded-full blur-[150px] opacity-5" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00f0ff] rounded-full blur-[120px] opacity-5" />
              
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="text-5xl mb-6"
                >
                  📬
                </motion.div>
                
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Receba dicas de{" "}
                  <span className="neon-text-green">dev</span>
                </h2>
                <p className="text-[#9999ab] mb-8 max-w-md mx-auto">
                  Artigos, tutoriais e novidades sobre React, Next.js e desenvolvimento web moderno. Sem spam, prometo!
                </p>
                
                <form 
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: Integrar com serviço de newsletter
                    alert("Newsletter em breve! Por enquanto, me siga no Instagram @emmanuelbezerra_");
                  }}
                >
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-[#1e1e2e] text-white placeholder:text-[#6b6b80] focus:border-[#00ff41]/50 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-xl font-bold text-black bg-[#00ff41] hover:shadow-[0_0_40px_rgba(0,255,65,0.5)] transition-all duration-300"
                  >
                    Inscrever
                  </button>
                </form>
                
                <p className="text-xs text-[#6b6b80] mt-4">
                  +500 devs já inscritos • Cancele quando quiser
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PROCESS — How I Work Timeline
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="processo" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f0ff]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-10 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-6">
                <span className="text-sm font-mono text-[#00f0ff]">
                  {"<Process />"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Como{" "}
                <span className="gradient-text-cyber">trabalho</span>
              </h2>
              <p className="text-[#6b6b80] text-lg max-w-2xl mx-auto">
                Processo estruturado para garantir entregas de qualidade
              </p>
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="relative">
            {/* Animated vertical line */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-[#00f0ff]/50 via-[#ff00ff]/50 to-[#00ff41]/50 hidden lg:block"
            />
            
            <div className="space-y-12 lg:space-y-24">
              {[
                {
                  step: "01",
                  title: "Discovery Call",
                  desc: "Reunião gratuita de 30min para entender seu projeto, objetivos e desafios. Sem compromisso.",
                  icon: <Headphones className="w-6 h-6" />,
                  color: "#00f0ff",
                  duration: "30 min",
                  items: ["Análise de requisitos", "Definição de escopo", "Alinhamento de expectativas"],
                },
                {
                  step: "02",
                  title: "Proposta & Contrato",
                  desc: "Proposta detalhada com cronograma, entregas e investimento. Contrato digital seguro.",
                  icon: <FileText className="w-6 h-6" />,
                  color: "#ff00ff",
                  duration: "24-48h",
                  items: ["Orçamento transparente", "Cronograma realista", "Contrato digital"],
                },
                {
                  step: "03",
                  title: "Design & Aprovação",
                  desc: "Wireframes e protótipos navegáveis para aprovação antes de uma linha de código.",
                  icon: <Target className="w-6 h-6" />,
                  color: "#00ff41",
                  duration: "3-5 dias",
                  items: ["Wireframes interativos", "Design responsivo", "Revisões inclusas"],
                },
                {
                  step: "04",
                  title: "Desenvolvimento",
                  desc: "Código limpo, testes automatizados e updates semanais. Acompanhe em tempo real.",
                  icon: <Code2 className="w-6 h-6" />,
                  color: "#00f0ff",
                  duration: "2-8 semanas",
                  items: ["Sprints semanais", "Deploys de preview", "Comunicação constante"],
                },
                {
                  step: "05",
                  title: "QA & Lançamento",
                  desc: "Testes rigorosos, otimização SEO, configuração de analytics e go-live assistido.",
                  icon: <Rocket className="w-6 h-6" />,
                  color: "#ff00ff",
                  duration: "2-3 dias",
                  items: ["Testes cross-browser", "Otimização SEO", "Deploy production"],
                },
                {
                  step: "06",
                  title: "Suporte Contínuo",
                  desc: "30 dias de suporte gratuito pós-entrega. Planos mensais de manutenção disponíveis.",
                  icon: <RefreshCw className="w-6 h-6" />,
                  color: "#00ff41",
                  duration: "Ongoing",
                  items: ["30 dias grátis", "Correção de bugs", "Atualizações de segurança"],
                },
              ].map((phase, i) => (
                <Reveal key={i} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                    {/* Content */}
                    <div className={`flex-1 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                      <div className={`flex items-center gap-3 mb-4 ${i % 2 === 1 ? "lg:justify-end" : ""}`}>
                        <span 
                          className="text-4xl font-black font-mono"
                          style={{ color: phase.color, textShadow: `0 0 20px ${phase.color}40` }}
                        >
                          {phase.step}
                        </span>
                        <span 
                          className="px-3 py-1 text-xs font-mono rounded-full"
                          style={{ background: `${phase.color}15`, color: phase.color, border: `1px solid ${phase.color}30` }}
                        >
                          {phase.duration}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{phase.title}</h3>
                      <p className="text-[#9999ab] mb-4">{phase.desc}</p>
                      <ul className={`space-y-2 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                        {phase.items.map((item, ii) => (
                          <li key={ii} className={`flex items-center gap-2 text-sm text-[#6b6b80] ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                            <CheckCircle className="w-4 h-4" style={{ color: phase.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Icon node */}
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `${phase.color}15`,
                          border: `2px solid ${phase.color}40`,
                          boxShadow: `0 0 30px ${phase.color}30`,
                          color: phase.color,
                        }}
                      >
                        {phase.icon}
                      </motion.div>
                    </div>

                    {/* Spacer for layout */}
                    <div className="flex-1 hidden lg:block" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PACKAGES — Pricing Plans
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="pacotes" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff00ff]/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff00ff]/20 bg-[#ff00ff]/5 mb-6">
                <span className="text-sm font-mono text-[#ff00ff]">
                  {"<Packages />"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Pacotes &{" "}
                <span className="gradient-text-cyber">Investimento</span>
              </h2>
              <p className="text-[#6b6b80] text-lg max-w-2xl mx-auto">
                Soluções para cada fase do seu negócio — do MVP à escala
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                subtitle: "Landing Page",
                price: "2.500",
                description: "Ideal para validar ideias e captar leads",
                color: "#00f0ff",
                popular: false,
                features: [
                  { text: "1 página responsiva", included: true },
                  { text: "Design personalizado", included: true },
                  { text: "Animações modernas", included: true },
                  { text: "Formulário de contato", included: true },
                  { text: "SEO básico", included: true },
                  { text: "Entrega em 7 dias", included: true },
                  { text: "Painel administrativo", included: false },
                  { text: "Integrações avançadas", included: false },
                ],
                cta: "Começar Projeto",
              },
              {
                name: "Pro",
                subtitle: "Site Institucional",
                price: "5.500",
                description: "Para empresas que querem presença profissional",
                color: "#ff00ff",
                popular: true,
                features: [
                  { text: "Até 5 páginas", included: true },
                  { text: "Design premium", included: true },
                  { text: "Blog integrado", included: true },
                  { text: "Painel admin básico", included: true },
                  { text: "SEO completo", included: true },
                  { text: "Analytics configurado", included: true },
                  { text: "Integrações (WhatsApp, Maps)", included: true },
                  { text: "Entrega em 14 dias", included: true },
                ],
                cta: "Mais Popular",
              },
              {
                name: "Enterprise",
                subtitle: "Plataforma/SaaS",
                price: "15.000",
                description: "Soluções complexas sob medida",
                color: "#00ff41",
                popular: false,
                features: [
                  { text: "Páginas ilimitadas", included: true },
                  { text: "Sistema de usuários", included: true },
                  { text: "Dashboard completo", included: true },
                  { text: "APIs & Integrações", included: true },
                  { text: "Pagamentos online", included: true },
                  { text: "App mobile (PWA)", included: true },
                  { text: "CI/CD & DevOps", included: true },
                  { text: "Suporte prioritário", included: true },
                ],
                cta: "Falar Comigo",
              },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative glass-card rounded-3xl p-8 border transition-all duration-500 h-full flex flex-col ${
                    plan.popular 
                      ? "border-[#ff00ff]/50 shadow-[0_0_60px_rgba(255,0,255,0.15)]" 
                      : "border-[#1e1e2e] hover:border-[color:var(--plan-color)]/30"
                  }`}
                  style={{ "--plan-color": plan.color } as React.CSSProperties}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-[#ff00ff] text-black">
                        MAIS VENDIDO
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <span 
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: plan.color }}
                    >
                      {plan.name}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{plan.subtitle}</h3>
                    <div className="mt-4">
                      <span className="text-sm text-[#6b6b80]">A partir de</span>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm text-[#6b6b80]">R$</span>
                        <span 
                          className="text-5xl font-black"
                          style={{ color: plan.color, textShadow: `0 0 30px ${plan.color}40` }}
                        >
                          {plan.price}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#6b6b80] mt-2">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-center gap-3">
                        {feature.included ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: plan.color }} />
                        ) : (
                          <X className="w-5 h-5 flex-shrink-0 text-[#3a3a4a]" />
                        )}
                        <span className={feature.included ? "text-[#9999ab]" : "text-[#4a4a5a]"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/orcamento"
                    className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${
                      plan.popular
                        ? "bg-[#ff00ff] text-black hover:shadow-[0_0_40px_rgba(255,0,255,0.5)]"
                        : "border-2 text-white hover:bg-white/5"
                    }`}
                    style={!plan.popular ? { borderColor: `${plan.color}50`, color: plan.color } : {}}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Custom note */}
          <Reveal delay={0.4}>
            <div className="text-center mt-12">
              <p className="text-[#6b6b80]">
                Precisa de algo diferente?{" "}
                <a href="#contato" className="text-[#00f0ff] hover:underline">
                  Vamos conversar sobre seu projeto específico
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          GUARANTEES — Trust Badges
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="garantias" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff41]/[0.02] to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Garantias que dou aos meus{" "}
                <span className="neon-text-green">clientes</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Código Proprietário",
                desc: "100% seu. Entrego todo código fonte e documentação.",
                color: "#00f0ff",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Prazo Garantido",
                desc: "Entrega no prazo ou desconto de 10% por dia de atraso.",
                color: "#ff00ff",
              },
              {
                icon: <RefreshCw className="w-8 h-8" />,
                title: "Revisões Inclusas",
                desc: "Até 3 rodadas de revisão sem custo adicional.",
                color: "#00ff41",
              },
              {
                icon: <Headphones className="w-8 h-8" />,
                title: "Suporte 30 Dias",
                desc: "Pós-entrega gratuito para correções e dúvidas.",
                color: "#00f0ff",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "NDA Disponível",
                desc: "Confidencialidade total se seu projeto exigir.",
                color: "#ff00ff",
              },
              {
                icon: <BadgeCheck className="w-8 h-8" />,
                title: "Qualidade Testada",
                desc: "Testes automatizados e QA em todos os projetos.",
                color: "#00ff41",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Performance A+",
                desc: "Otimização para 90+ no PageSpeed Insights.",
                color: "#00f0ff",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Comunicação Clara",
                desc: "Updates semanais e resposta em até 24h.",
                color: "#ff00ff",
              },
            ].map((guarantee, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 rounded-xl border border-[#1e1e2e] hover:border-[color:var(--g-color)]/30 transition-all text-center"
                  style={{ "--g-color": guarantee.color } as React.CSSProperties}
                >
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ 
                      background: `${guarantee.color}15`, 
                      border: `1px solid ${guarantee.color}30`,
                      color: guarantee.color 
                    }}
                  >
                    {guarantee.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2">{guarantee.title}</h3>
                  <p className="text-sm text-[#6b6b80]">{guarantee.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          AVAILABILITY — Limited Slots CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/10 via-[#ff00ff]/10 to-[#00ff41]/10" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="glass-card rounded-3xl p-10 lg:p-16 border border-[#00f0ff]/20 relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff] rounded-full blur-[150px] opacity-10" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff00ff] rounded-full blur-[120px] opacity-10" />
              
              <div className="relative z-10 text-center">
                {/* Live indicator */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff41]/30 bg-[#00ff41]/10 mb-6">
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-[#00ff41]"
                  />
                  <span className="text-sm font-mono text-[#00ff41]">
                    Disponível para novos projetos
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                  Apenas{" "}
                  <span className="neon-text-cyan">2 vagas</span>
                  {" "}disponíveis
                </h2>
                <p className="text-lg text-[#9999ab] mb-4 max-w-xl mx-auto">
                  Para garantir qualidade máxima, trabalho com no máximo 3 projetos simultaneamente.
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00f0ff]">&lt;2h</div>
                    <div className="text-xs text-[#6b6b80]">Tempo de resposta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff00ff]">100%</div>
                    <div className="text-xs text-[#6b6b80]">Taxa de satisfação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00ff41]">15+</div>
                    <div className="text-xs text-[#6b6b80]">Projetos entregues</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/orcamento"
                    className="group px-8 py-4 rounded-xl font-bold text-black bg-[#00f0ff] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-300 flex items-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    Iniciar Projeto
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="https://wa.me/5585998500344?text=Ol%C3%A1%20Emmanuel!%20Gostaria%20de%20agendar%20uma%20call%20gratuita%20para%20discutir%20meu%20projeto."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl font-bold border-2 border-[#ff00ff]/50 text-[#ff00ff] hover:bg-[#ff00ff]/10 transition-all duration-300 flex items-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Agendar Call Gratuita
                  </a>
                </div>

                <p className="text-xs text-[#6b6b80] mt-6">
                  📞 Discovery call de 30min • Sem compromisso • 100% gratuita
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTACT — Premium CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="contato" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
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
