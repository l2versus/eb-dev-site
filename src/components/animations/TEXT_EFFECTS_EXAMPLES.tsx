// ══════════════════════════════════════════════════════════════════════════════
// 🎨 Exemplos — Parallax Text Contrast Effects
// ══════════════════════════════════════════════════════════════════════════════

import {
  ParallaxTextContrast,
  ParallaxTextMultiline,
  ContrastShift,
  BlurredReveal,
  MorphingColorParallax,
} from "@/components/animations";

/**
 * EFEITO 1: Parallax Text Contrast (IR E VOLTAR)
 * 
 * Texto que se move horizontalmente (vai e volta) e muda de blur/contraste
 * Ideal para titles, headings, call-to-action
 */
export function Example1_ParallaxTextContrast() {
  return (
    <ParallaxTextContrast
      text="Emmanuel Bezerra"
      className="text-7xl md:text-8xl font-bold text-center"
      textClassName="text-orange-400"
      blurStart={15} // Começa com 15px de blur
      blurEnd={0} // Termina nítido
      scale={1.2} // Intensidade do parallax
    />
  );
}

/**
 * EFEITO 2: Multiline Parallax (CASCATA)
 * 
 * Cada linha se move em direção diferente
 * Cria efeito de "onda" conforme scroll
 */
export function Example2_ParallaxTextMultiline() {
  const lines = [
    "Escolha a",
    "escala",
    "perfeita",
    "para seu projeto"
  ];

  return (
    <ParallaxTextMultiline
      lines={lines}
      className="text-5xl md:text-6xl font-bold"
      lineClassName="text-white"
      staggerDelay={0.1}
    />
  );
}

/**
 * EFEITO 3: Contrast Shift (PINTURA)
 * 
 * Muda contraste e brightness conforme scroll
 * Efeito de "pintura" aparecendo
 */
export function Example3_ContrastShift() {
  return (
    <ContrastShift
      contrastStart={0.4}
      contrastEnd={1.3}
      brightnessStart={0.6}
      brightnessEnd={1.2}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-5xl font-bold text-center text-orange-400">
        Direção Visual
      </h2>
      <p className="text-xl text-gray-300 text-center mt-6">
        Defino ritmo, hierarquia, copy principal, referências e o papel de cada
        interação no scroll.
      </p>
    </ContrastShift>
  );
}

/**
 * EFEITO 4: Blurred Reveal (APARECER NÍTIDO)
 * 
 * Texto começa desfocado e fica nítido com scroll
 * Efeito premium de "foco" sendo aplicado
 */
export function Example4_BlurredReveal() {
  return (
    <BlurredReveal
      text="Projetos de impacto que transformam negócios"
      className="text-6xl md:text-7xl font-bold leading-tight max-w-4xl"
      textClassName="text-white"
      blurAmount={20}
    />
  );
}

/**
 * EFEITO 5: Morphing Colors + Parallax (GRADIENTE ANIMADO)
 * 
 * Texto muda de cor em gradiente e se move
 * Muito visual, perfeito para hero sections
 */
export function Example5_MorphingColorParallax() {
  return (
    <MorphingColorParallax
      text="GSAP Premium"
      colors={[
        "#FFB84D", // Amarelo/Laranja
        "#FF7A5C", // Laranja salmão
        "#FF3D5A", // Vermelho coral
        "#C13A7D", // Rosa/Magenta
      ]}
      className="text-7xl md:text-8xl font-bold text-center"
    />
  );
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * PÁGINA COMPLETA COM TODOS OS EFEITOS
 * ════════════════════════════════════════════════════════════════════════════════
 */

export function FullPageExample() {
  return (
    <div className="bg-dark-950 text-white overflow-hidden">
      {/* Hero com Parallax Text Contrast */}
      <section className="h-screen flex items-center justify-center">
        <ParallaxTextContrast
          text="Emmanuel Bezerra"
          className="text-7xl md:text-8xl font-bold text-center"
          textClassName="text-orange-400"
          blurStart={12}
          blurEnd={0}
        />
      </section>

      {/* Spacer */}
      <section className="h-96" />

      {/* Multiline Effect */}
      <section className="relative">
        <ParallaxTextMultiline
          lines={[
            "Desenvolvedor",
            "Full-Stack",
            "Especialista em",
            "Experiências Premium"
          ]}
          className="text-5xl md:text-6xl font-bold text-center"
          lineClassName="text-white"
        />
      </section>

      {/* Spacer */}
      <section className="h-96" />

      {/* Contrast Shift */}
      <section className="relative py-32">
        <ContrastShift
          contrastStart={0.5}
          contrastEnd={1.4}
          className="max-w-5xl mx-auto px-6"
        >
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-orange-400 mb-6">
              Direção Visual
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Defino ritmo, hierarquia, copy principal, referências e o papel de cada
              interação no scroll com precisão cinematográfica.
            </p>
          </div>
        </ContrastShift>
      </section>

      {/* Spacer */}
      <section className="h-96" />

      {/* Blurred Reveal */}
      <section className="relative">
        <BlurredReveal
          text="Transformo ideias em experiências memoráveis através de código e design"
          className="text-6xl md:text-7xl font-bold leading-tight text-center max-w-4xl mx-auto px-6"
          textClassName="text-white"
          blurAmount={16}
        />
      </section>

      {/* Spacer */}
      <section className="h-96" />

      {/* Morphing Colors */}
      <section className="relative py-40">
        <MorphingColorParallax
          text="PREMIUM ANIMATIONS"
          colors={["#FFB84D", "#FF7A5C", "#FF3D5A", "#C13A7D", "#8B2FA0"]}
          className="text-7xl md:text-8xl font-bold text-center"
        />
      </section>

      {/* Final spacer */}
      <section className="h-96" />
    </div>
  );
}

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * QUICK REFERENCE - QUANDO USAR CADA EFEITO
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 1. ParallaxTextContrast
 *    ✅ Usar para: Titles, hero text, call-to-action
 *    Props: text, blurStart, blurEnd, scale
 *    Efeito: Texto vai-e-volta com blur → nítido
 * 
 * 2. ParallaxTextMultiline
 *    ✅ Usar para: Poesia, headlines, citações
 *    Props: lines[], staggerDelay
 *    Efeito: Cada linha se move em cascata
 * 
 * 3. ContrastShift
 *    ✅ Usar para: Descrições, parágrafos, seções
 *    Props: contrastStart, contrastEnd, brightnessStart, brightnessEnd
 *    Efeito: Imagem/texto fica mais vivido conforme scroll
 * 
 * 4. BlurredReveal
 *    ✅ Usar para: Títulos secundários, emphasis
 *    Props: text, blurAmount
 *    Efeito: Desfocado → nítido (com opacity)
 * 
 * 5. MorphingColorParallax
 *    ✅ Usar para: Destaque, brand elements
 *    Props: text, colors[]
 *    Efeito: Muda de cor em gradiente + movimento
 */
