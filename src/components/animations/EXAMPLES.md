// ══════════════════════════════════════════════════════════════════════════════
// 📚 Guia de Uso — GSAP Animations Premium
// ══════════════════════════════════════════════════════════════════════════════

/**
 * COMPONENTES DISPONÍVEIS
 * 
 * 1. PARALLAX COM GSAP
 *    - ParallaxGSAP: Parallax vertical/horizontal com ScrollTrigger
 *    - ParallaxFadeGSAP: Parallax com fade opacity
 *    - ParallaxRotateGSAP: Parallax com rotação 3D
 *    - MultiLayerParallax: Múltiplas camadas com velocidades diferentes
 * 
 * 2. SCROLL REVEAL COM GSAP
 *    - ScrollRevealGSAP: Reveal animado com múltiplas opções
 *    - StaggerReveal: Múltiplos elementos com delay em série
 *    - TextRevealGSAP: Animar texto letra por letra (Premium)
 *    - CounterGSAP: Contadores animados para KPIs
 * 
 * 3. HERO PARALLAX
 *    - HeroParallaxGSAP: Hero section completo com parallax, text reveal
 *    - MinimalHeroParallax: Versão minimalista
 * 
 * 4. TIMELINES AVANÇADAS
 *    - MorphSVGGSAP: Morph entre shapes SVG
 *    - AdvancedTimeline: Timeline com múltiplos elementos
 *    - FLIPAnimation: FLIP layout animations (Posição → Layout → Invert → Play)
 *    - SequenceTimeline: Sequências sincronizadas
 *    - StaggerMaster: Grid com stagger automático
 * 
 * 5. HOOKS CUSTOMIZADOS
 *    - useGSAPAnimation: Cria animação personalizada
 *    - useGSAPStagger: Anima múltiplos elementos
 *    - useScrollTrigger: Listener para ScrollTrigger
 *    - useScrollTriggerRefresh: Refresh automático
 *    - useParallaxVelocity: Parallax baseado em velocidade de scroll
 *    - useMouseParallax: Parallax controlado pelo mouse
 */

// ═══════════════════════════════════════════════════════════════════════════════
// EXEMPLOS DE USO
// ═══════════════════════════════════════════════════════════════════════════════

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 1: ParallaxGSAP Simples
   ────────────────────────────────────────────────────────────────────────────── */

// import { ParallaxGSAP } from "@/components/animations";

// export function ExampleParallax() {
//   return (
//     <ParallaxGSAP speed={0.5} direction="vertical" className="h-96">
//       <img src="/bg.jpg" alt="Background" className="w-full h-full object-cover" />
//     </ParallaxGSAP>
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 2: ScrollRevealGSAP com Stagger
   ────────────────────────────────────────────────────────────────────────────── */

// import { StaggerReveal } from "@/components/animations";

// export function ExampleStagger() {
//   const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

//   return (
//     <StaggerReveal animation="fade-up" staggerDelay={0.2}>
//       {items.map((item) => (
//         <div key={item} className="p-8 bg-blue-500 text-white rounded-lg">
//           {item}
//         </div>
//       ))}
//     </StaggerReveal>
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 3: HeroParallaxGSAP Completo
   ────────────────────────────────────────────────────────────────────────────── */

// import { HeroParallaxGSAP } from "@/components/animations";

// export function ExampleHeroParallax() {
//   return (
//     <HeroParallaxGSAP
//       title="Bem-vindo ao futuro"
//       subtitle="Animações premium com GSAP e ScrollTrigger"
//       backgroundImage="/hero-bg.jpg"
//       height="100vh"
//       titleAnimation="slide"
//     >
//       <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold">
//         Começar Agora
//       </button>
//     </HeroParallaxGSAP>
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 4: useGSAPAnimation Hook
   ────────────────────────────────────────────────────────────────────────────── */

// import { useGSAPAnimation } from "@/hooks/use-gsap-animation";

// export function ExampleHook() {
//   const ref = useGSAPAnimation({
//     from: { opacity: 0, y: 50 },
//     to: { opacity: 1, y: 0 },
//     duration: 0.8,
//     scrollTrigger: {
//       trigger: ".my-element",
//       start: "top 80%",
//       once: true,
//     },
//   });

//   return (
//     <div ref={ref} className="my-element">
//       Conteúdo que vai animar
//     </div>
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 5: TextRevealGSAP (Letra por Letra)
   ────────────────────────────────────────────────────────────────────────────── */

// import { TextRevealGSAP } from "@/components/animations";

// export function ExampleTextReveal() {
//   return (
//     <TextRevealGSAP
//       text="PREMIUM TEXT ANIMATION"
//       duration={1.5}
//       staggerChar={0.08}
//       className="text-6xl font-bold text-center"
//     />
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 6: CounterGSAP (KPIs)
   ────────────────────────────────────────────────────────────────────────────── */

// import { CounterGSAP } from "@/components/animations";

// export function ExampleCounter() {
//   return (
//     <div className="grid grid-cols-3 gap-8">
//       <CounterGSAP
//         to={500}
//         prefix="+"
//         suffix="k"
//         duration={2}
//         className="text-4xl font-bold text-blue-500"
//       />
//       <CounterGSAP
//         to={99.9}
//         prefix=""
//         suffix="%"
//         decimals={1}
//         className="text-4xl font-bold text-green-500"
//       />
//       <CounterGSAP
//         to={1000}
//         prefix="$"
//         duration={3}
//         className="text-4xl font-bold text-orange-500"
//       />
//     </div>
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 7: MultiLayerParallax
   ────────────────────────────────────────────────────────────────────────────── */

// import { MultiLayerParallax } from "@/components/animations";

// export function ExampleMultiLayer() {
//   return (
//     <MultiLayerParallax
//       layers={[
//         {
//           id: "bg",
//           speed: 0.2,
//           element: <img src="/bg.jpg" alt="Background" className="absolute inset-0" />,
//         },
//         {
//           id: "mid",
//           speed: 0.5,
//           element: <img src="/mid.jpg" alt="Midground" className="absolute inset-0" />,
//         },
//         {
//           id: "fg",
//           speed: 1,
//           element: <img src="/fg.jpg" alt="Foreground" className="absolute inset-0" />,
//         },
//       ]}
//       className="relative w-full h-screen overflow-hidden"
//     />
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 8: useMouseParallax (Interação com Mouse)
   ────────────────────────────────────────────────────────────────────────────── */

// import { useMouseParallax } from "@/hooks/use-gsap-animation";

// export function ExampleMouseParallax() {
//   const ref = useMouseParallax(15);

//   return (
//     <div
//       ref={ref}
//       className="w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-2xl"
//     />
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 9: SequenceTimeline
   ────────────────────────────────────────────────────────────────────────────── */

// import { SequenceTimeline } from "@/components/animations";

// export function ExampleSequence() {
//   return (
//     <SequenceTimeline
//       sequences={[
//         {
//           id: "box-1",
//           from: { opacity: 0, scale: 0.8 },
//           to: { opacity: 1, scale: 1 },
//           duration: 0.8,
//         },
//         {
//           id: "box-2",
//           from: { opacity: 0, x: -50 },
//           to: { opacity: 1, x: 0 },
//           duration: 0.8,
//           delay: 0.2,
//         },
//         {
//           id: "box-3",
//           from: { opacity: 0, rotate: -45 },
//           to: { opacity: 1, rotate: 0 },
//           duration: 0.8,
//           delay: 0.4,
//         },
//       ]}
//     />
//   );
// }

/* ──────────────────────────────────────────────────────────────────────────────
   EXEMPLO 10: StaggerMaster (Grid com Stagger)
   ────────────────────────────────────────────────────────────────────────────── */

// import { StaggerMaster } from "@/components/animations";

// export function ExampleStaggerMaster() {
//   const items = Array.from({ length: 9 }, (_, i) => (
//     <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg" />
//   ));

//   return (
//     <StaggerMaster
//       gridItems={items}
//       gridClassName="grid grid-cols-3 gap-4 max-w-4xl mx-auto"
//       staggerAmount={0.15}
//       animationDuration={0.6}
//     />
//   );
// }

// ═══════════════════════════════════════════════════════════════════════════════
// PROPS COMUNS
// ═══════════════════════════════════════════════════════════════════════════════

/*
 * ANIMAÇÕES SUPORTADAS:
 * - fade-up: Fade + Move up
 * - fade-down: Fade + Move down
 * - fade-left: Fade + Move left
 * - fade-right: Fade + Move right
 * - scale: Fade + Scale up
 * - blur: Fade com blur effect
 * - rotate: Fade + Rotation
 * - flip: 3D flip (rotationY)
 * - slide-up: Slide mais agressivo
 * - slide-down: Slide more agressivo (down)
 * - slide-left: Slide left agressivo
 * - slide-right: Slide right agressivo
 */

/*
 * EASE FUNCTIONS (GSAP):
 * - "linear": Linear motion
 * - "power1.out", "power2.out", "power3.out", "power4.out"
 * - "power1.in", "power2.in", "power3.in", "power4.in"
 * - "power1.inOut", "power2.inOut", "power3.inOut", "power4.inOut"
 * - "sine.out", "sine.in", "sine.inOut"
 * - "expo.out", "expo.in", "expo.inOut"
 * - "circ.out", "circ.in", "circ.inOut"
 * - "back.out", "back.in", "back.inOut"
 * - "elastic.out", "elastic.in", "elastic.inOut"
 * - "bounce.out", "bounce.in"
 */

/*
 * SCROLL TRIGGER CONFIG:
 * - start: "top 80%" - Quando o top do elemento entra em 80% da viewport
 * - end: "bottom 20%" - Quando o bottom sai em 20% da viewport
 * - scrub: 0.6 - Smooth scroll-linked animation
 * - once: true - Play apenas uma vez
 * - markers: false - Debug visual (use true para debug)
 */

export const GSAP_EXAMPLES = "Veja os exemplos comentados acima para implementar!";
