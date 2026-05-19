"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Mail,
  MessageCircle,
  Minus,
  Plus,
  Send,
} from "lucide-react";
import { FractureText } from "@/components/FractureText";
import { gsap, isReducedMotion } from "@/lib/gsap";

const packages = [
  {
    name: "Launch",
    price: "2.500",
    note: "Landing page interativa para uma oferta especifica.",
    items: ["Direcao visual", "Copy principal", "Motion essencial", "WhatsApp/formulario"],
    accent: "#ffc090",
  },
  {
    name: "Studio",
    price: "5.500",
    note: "Site autoral completo para marca, autoridade e captacao.",
    items: ["Ate 5 secoes/paginas", "Scroll narrativo", "Projetos/cases", "SEO e analytics"],
    accent: "#9fcaab",
  },
  {
    name: "System",
    price: "15.000+",
    note: "Produto web com painel, automacoes e integracoes reais.",
    items: ["Area admin", "Login/permissoes", "APIs/pagamentos", "Deploy acompanhado"],
    accent: "#8bb7d6",
  },
];

const faqs = [
  {
    q: "Esse visual funciona no celular?",
    a: "Sim. A experiencia vira uma versao touch-first: menos pin pesado, mais leitura, imagens bem enquadradas e movimento calibrado.",
  },
  {
    q: "Da para usar minhas fotos reais?",
    a: "Da e deve. Foto boa muda o nivel do site. Eu trato as imagens como camadas de narrativa, nao como decoracao jogada.",
  },
  {
    q: "Voce entrega so design ou codigo tambem?",
    a: "Entrego o produto em codigo. O diferencial e construir UI, performance, conteudo e motion juntos.",
  },
  {
    q: "Quanto tempo leva?",
    a: "Landing costuma ficar entre 7 e 14 dias. Site mais completo entre 2 e 4 semanas. Sistema depende do escopo.",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="faq-row border-b border-[#f5f0e6]/12">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex w-full items-center justify-between gap-6 py-7 text-left"
      >
        <span className="max-w-2xl text-xl font-semibold text-[#f5f0e6]">{q}</span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f5f0e6]/16 text-[#ffc090] transition-colors group-hover:bg-[#ffc090] group-hover:text-[#14110e]">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-7" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="max-w-2xl text-base leading-7 text-[#cfc0af]">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function OfferSections() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      gsap.from(".offer-title-line", {
        yPercent: 112,
        rotate: 2,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".offer-heading",
          start: "top 82%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".offer-fracture .fracture-char", {
        x: (index) => ((index % 5) - 2) * 15,
        y: (index) => (index % 2 === 0 ? 34 : -24),
        rotate: (index) => ((index % 6) - 2.5) * 6,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.78,
        ease: "expo.out",
        stagger: { each: 0.012, from: "edges" },
        scrollTrigger: {
          trigger: ".offer-heading",
          start: "top 82%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".offer-copy > *", {
        y: 28,
        opacity: 0,
        duration: 0.78,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: ".offer-copy",
          start: "top 82%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".package-card", {
        y: 62,
        opacity: 0,
        rotate: -2,
        duration: 0.95,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".package-grid",
          start: "top 82%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.utils.toArray<HTMLElement>(".package-card").forEach((card) => {
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const rx = ((y / rect.height) - 0.5) * -7;
          const ry = ((x / rect.width) - 0.5) * 7;

          gsap.to(card, {
            rotateX: rx,
            rotateY: ry,
            y: -8,
            duration: 0.45,
            ease: "power3.out",
            transformPerspective: 900,
          });
        };

        const onLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.75,
            ease: "elastic.out(1,0.45)",
          });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      gsap.from(".faq-row", {
        y: 30,
        opacity: 0,
        duration: 0.75,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: ".faq-list",
          start: "top 84%",
          toggleActions: "play reverse play reverse",
        },
      });

      const contactTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".contact-stage",
          start: "top 75%",
          toggleActions: "play reverse play reverse",
        },
      });

      contactTl
        .from(".contact-word", { yPercent: 112, rotate: 2, duration: 1, ease: "expo.out", stagger: 0.08 })
        .from(
          ".contact-fracture .fracture-char",
          {
            x: (index) => ((index % 5) - 2) * 18,
            y: (index) => (index % 2 === 0 ? 40 : -30),
            rotate: (index) => ((index % 7) - 3) * 6,
            opacity: 0,
            filter: "blur(9px)",
            duration: 0.82,
            ease: "expo.out",
            stagger: { each: 0.012, from: "random" },
          },
          0.08,
        )
        .from(".contact-panel", { y: 50, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.18)
        .from(".contact-action", { y: 24, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.07 }, 0.35);
    }, root);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#0d0d0b] text-[#f5f0e6]">
      <section id="pacotes" className="relative border-t border-[#f5f0e6]/12 py-24 sm:py-32 lg:py-36">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,240,230,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(245,240,230,0.045)_1px,transparent_1px)] bg-[size:92px_92px]" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0d0d0b] to-transparent" />
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="offer-heading grid gap-8 border-b border-[#f5f0e6]/12 pb-10 lg:grid-cols-[1fr_0.62fr] lg:items-end">
            <h2 className="font-display text-[clamp(4rem,8vw,9rem)] leading-[0.84]">
              <span className="block overflow-hidden">
                <FractureText text="Escolha a" className="offer-title-line offer-fracture block" />
              </span>
              <span className="block overflow-hidden text-[#ffc090]">
                <FractureText text="escala." className="offer-title-line offer-fracture block" />
              </span>
            </h2>
            <div className="offer-copy max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9fcaab]">
                Rebranding, site ou sistema
              </p>
              <p className="mt-4 text-lg leading-8 text-[#cfc0af]">
                O nivel de experiencia acompanha o tamanho do objetivo. A
                base e sempre a mesma: direcao clara, execucao forte e motion
                com funcao.
              </p>
            </div>
          </div>

          <div className="package-grid mt-12 grid gap-5 lg:grid-cols-3">
            {packages.map((pack, index) => (
              <article
                key={pack.name}
                className="package-card flex min-h-0 flex-col border border-[#f5f0e6]/12 bg-[#151411]/90 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.36)] backdrop-blur-xl will-change-transform lg:min-h-[560px]"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fcaab]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-5 font-display text-6xl leading-none">{pack.name}</h3>
                  </div>
                  {index === 1 && (
                    <span className="rounded-full border border-[#9fcaab]/28 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9fcaab]">
                      Melhor ponto
                    </span>
                  )}
                </div>

                <p className="mt-8 max-w-sm text-base leading-7 text-[#cfc0af]">{pack.note}</p>

                <div className="mt-9 flex items-baseline gap-2">
                  <span className="font-mono text-sm text-[#cfc0af]">R$</span>
                  <span className="font-display text-7xl leading-none" style={{ color: pack.accent }}>
                    {pack.price}
                  </span>
                </div>

                <ul className="mt-9 space-y-4">
                  {pack.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-[#d8cfbf]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: pack.accent }} />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  data-magnetic
                  href="/orcamento"
                  className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ffc090] px-5 text-sm font-semibold text-[#14110e] transition-colors hover:bg-[#f5f0e6]"
                >
                  Pedir orcamento
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-[#f5f0e6]/12 py-24 sm:py-30 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.72fr_1fr] lg:px-12">
          <div className="offer-copy lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9fcaab]">
              Antes de comecar
            </p>
            <h2 className="mt-5 font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[0.86]">
              Perguntas que limpam o caminho.
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="contato"
        className="contact-stage relative overflow-hidden border-t border-[#f5f0e6]/12 bg-[#0d0d0b] py-24 text-[#f5f0e6] sm:py-32 lg:py-36"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,240,230,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(245,240,230,0.04)_1px,transparent_1px)] bg-[size:92px_92px]" />
        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:px-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9fcaab]">
              Proxima cena
            </p>
            <h2 className="mt-6 font-display text-[clamp(4.4rem,10vw,12rem)] leading-[0.78] text-[#ffc090]">
              <span className="block overflow-hidden">
                <FractureText text="Vamos" className="contact-word contact-fracture block" />
              </span>
              <span className="block overflow-hidden text-[#f5f0e6]">
                <FractureText text="construir." className="contact-word contact-fracture block" />
              </span>
            </h2>
          </div>

          <div className="contact-panel border border-[#f5f0e6]/14 bg-[#151411] p-6 sm:p-8">
            <p className="text-lg leading-8 text-[#cfc0af]">
              Se voce quer uma vitrine nova, um rebranding completo ou um
              sistema com experiencia premium, me chama com objetivo,
              referencias e prazo ideal.
            </p>
            <div className="mt-8 grid gap-3">
              <a
                data-magnetic
                href="https://wa.me/5585998500344?text=Ola%20Emmanuel!%20Quero%20construir%20uma%20experiencia%20digital%20interativa."
                target="_blank"
                rel="noopener noreferrer"
                className="contact-action inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ffc090] px-5 text-sm font-semibold text-[#14110e] transition-colors hover:bg-[#f5f0e6]"
              >
                <MessageCircle className="h-4 w-4" />
                Chamar no WhatsApp
              </a>
              <Link
                data-magnetic
                href="/orcamento"
                className="contact-action inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#f5f0e6]/18 px-5 text-sm font-semibold text-[#f5f0e6] transition-colors hover:border-[#ffc090] hover:text-[#ffc090]"
              >
                <Send className="h-4 w-4" />
                Enviar briefing
              </Link>
              <a
                data-magnetic
                href="mailto:emmanuelbezerra1992@gmail.com"
                className="contact-action inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#f5f0e6]/18 px-5 text-sm font-semibold text-[#f5f0e6] transition-colors hover:border-[#9fcaab] hover:text-[#9fcaab]"
              >
                <Mail className="h-4 w-4" />
                Email direto
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

