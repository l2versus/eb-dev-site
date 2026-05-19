# 🚀 GSAP Animations — Guia Completo de Implementação

## 📋 Sumário Rápido

Você recebeu **5 componentes premium** com GSAP + ScrollTrigger:

1. **Parallax Avançado** → `parallax-gsap.tsx`
2. **ScrollReveal** → `scroll-reveal-gsap.tsx`
3. **HeroParallax Premium** → `hero-parallax-gsap.tsx`
4. **Timelines Avançadas** → `advanced-timeline-gsap.tsx`
5. **6 Hooks Customizados** → `use-gsap-animation.ts`

---

## 🎯 Quando Usar Cada Componente

### 🆕 **ParallaxTextContrast** ⭐ (NOVO!)
```tsx
// Texto que vai-e-volta com blur → nítido (EFEITO QUEBRADO DO SEU SITE!)
<ParallaxTextContrast 
  text="Emmanuel Bezerra"
  blurStart={15}
  blurEnd={0}
  scale={1.2}
/>
```
**Use quando:** Quer o efeito de texto "indo e voltando" com mudança de contraste/blur

---

### 🆕 **ParallaxTextMultiline** ⭐ (NOVO!)
```tsx
// Múltiplas linhas se movem em cascata
<ParallaxTextMultiline 
  lines={["Escolha", "a", "escala"]}
  staggerDelay={0.15}
/>
```
**Use quando:** Poesia, headlines multi-linha, citações com efeito onda

---

### 🆕 **ContrastShift** ⭐ (NOVO!)
```tsx
// Contraste + brightness mudam com scroll (efeito pintura)
<ContrastShift 
  contrastStart={0.4} 
  contrastEnd={1.3}
>
  <h2>Direção Visual</h2>
</ContrastShift>
```
**Use quando:** Quer efeito de "pintura" aparecendo conforme scroll

---

### 🆕 **BlurredReveal** ⭐ (NOVO!)
```tsx
// Texto desfocado → nítido
<BlurredReveal 
  text="Transformar negócios"
  blurAmount={20}
/>
```
**Use quando:** Wants focused reveal effect (premium)

---

### 🆕 **MorphingColorParallax** ⭐ (NOVO!)
```tsx
// Cores gradiente + parallax simultâneo
<MorphingColorParallax 
  text="PREMIUM"
  colors={["#FFB84D", "#FF7A5C", "#FF3D5A"]}
/>
```
**Use quando:** Brand colors, destaque visual com movimento

---

### ParallaxGSAP ⚡
```tsx
// Parallax suave com ScrollTrigger
<ParallaxGSAP speed={0.5} direction="vertical">
  <img src="/background.jpg" alt="" className="w-full h-full object-cover" />
</ParallaxGSAP>
```
**Use quando:** Precisa de background parallax, imagens que se movem lentamente no scroll

---

### ScrollRevealGSAP ✨
```tsx
// Reveal animado quando entra na viewport
<ScrollRevealGSAP animation="fade-up" duration={0.8}>
  <h2>Seção importante</h2>
</ScrollRevealGSAP>
```
**Use quando:** Quer revelar elementos conforme o usuário scrolls

---

### HeroParallaxGSAP 🎬
```tsx
// Hero completo com parallax, text reveal, e efeitos
<HeroParallaxGSAP
  title="Título"
  subtitle="Subtítulo"
  backgroundImage="/hero.jpg"
  titleAnimation="slide"
/>
```
**Use quando:** Precisa de hero sections impactantes

---

### StaggerReveal 📊
```tsx
// Múltiplos elementos com animação em série
<StaggerReveal animation="fade-up" staggerDelay={0.15}>
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</StaggerReveal>
```
**Use quando:** Precisa animar cards, listas, grids em sequência

---

### TextRevealGSAP 📝
```tsx
// Anima texto letra por letra
<TextRevealGSAP 
  text="PREMIUM TEXT ANIMATION"
  duration={1.5}
  staggerChar={0.08}
  className="text-5xl font-bold"
/>
```
**Use quando:** Quer efeito premium de text reveal letra por letra

---

### CounterGSAP 📈
```tsx
// Contadores animados (KPIs, estatísticas)
<CounterGSAP
  to={500}
  prefix="+"
  suffix="k"
  duration={2}
  className="text-4xl font-bold"
/>
```
**Use quando:** Precisa animar números (KPIs, estatísticas, métricas)

---

### useGSAPAnimation Hook 🎯
```tsx
// Hook customizado para animações específicas
const ref = useGSAPAnimation({
  from: { opacity: 0, y: 50 },
  to: { opacity: 1, y: 0 },
  duration: 0.8,
  scrollTrigger: {
    trigger: ".element",
    start: "top 80%",
    once: true,
  },
});

return <div ref={ref} className="...">Conteúdo</div>;
```
**Use quando:** Precisa de animação customizada não coberta por componentes

---

### useMouseParallax Hook 🖱️
```tsx
// Parallax controlado pelo movimento do mouse
const ref = useMouseParallax(15); // sensitivity

return (
  <div ref={ref} className="w-40 h-40 bg-gradient-to-br ...">
    Elemento que segue o mouse
  </div>
);
```
**Use quando:** Precisa de interação com mouse (3D cards, elementos flutuantes)

---

## 🎨 Animações Disponíveis

| Nome | Efeito |
|------|--------|
| `fade-up` | Fade + Desliza para cima |
| `fade-down` | Fade + Desliza para baixo |
| `fade-left` | Fade + Desliza para esquerda |
| `fade-right` | Fade + Desliza para direita |
| `scale` | Fade + Cresce |
| `blur` | Fade com blur effect |
| `rotate` | Fade + Rotação |
| `flip` | Flip 3D (rotationY) |
| `slide-up` | Slide mais agressivo (up) |
| `slide-down` | Slide mais agressivo (down) |
| `slide-left` | Slide mais agressivo (left) |
| `slide-right` | Slide mais agressivo (right) |

---

## ⚙️ ScrollTrigger Config

```tsx
scrollTrigger={{
  start: "top 80%",      // Quando começa a animar
  end: "bottom 20%",     // Quando termina
  scrub: 0.6,            // Suavização (0.6s)
  once: true,            // Anima apenas uma vez
  markers: false,        // Debug visual (true para ver)
}}
```

**Valores comuns para `start`:**
- `"top 80%"` - Quando top do elemento entra em 80% da viewport
- `"top center"` - Quando top do elemento chega ao meio
- `"top 0%"` - Quando top do elemento toca o topo
- `"center center"` - Quando centro do elemento está no meio

---

## 🎯 Easings (GSAP)

### Power
- `"power1.out"` - Mais rápido no início, desacelera
- `"power2.out"` - Mais agressivo que power1
- `"power3.out"` - Muito agressivo
- `"power4.out"` - Extremamente agressivo

### Smooth
- `"sine.out"` - Suave e natural
- `"quad.out"` - Quadrático
- `"cubic.out"` - Cúbico

### Fun
- `"back.out"` - Volta um pouco para trás antes de avançar
- `"elastic.out"` - Efeito elástico
- `"bounce.out"` - Bounce effect

---

## 📦 Instalação

```bash
# Já feita! Mas se precisar:
npm install gsap @gsap/react
```

---

## 🔥 Padrões Recomendados

### 1. Page Load Animation
```tsx
export function Page() {
  return (
    <>
      <HeroParallaxGSAP title="Welcome" />
      <StaggerReveal>
        {sections.map(section => <Section key={section.id} {...section} />)}
      </StaggerReveal>
    </>
  );
}
```

### 2. Feature Cards com Parallax
```tsx
export function Features() {
  return (
    <div className="space-y-20">
      {features.map((feature) => (
        <ParallaxGSAP key={feature.id} speed={0.3}>
          <Card {...feature} />
        </ParallaxGSAP>
      ))}
    </div>
  );
}
```

### 3. Statistics Section
```tsx
export function Stats() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {stats.map((stat) => (
        <div key={stat.id}>
          <CounterGSAP to={stat.value} prefix={stat.prefix} />
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. Interactive Element
```tsx
export function InteractiveCard() {
  const ref = useMouseParallax(10);
  return <div ref={ref} className="...">Interactive Card</div>;
}
```

---

## 🐛 Debug & Performance

### Ver quando scroll triggers acontecem:
```tsx
<ScrollRevealGSAP animation="fade-up" markers={true}>
  Debug mode ativo!
</ScrollRevealGSAP>
```

### ScrollTrigger Refresh (depois de DOM changes):
```tsx
import { useScrollTriggerRefresh } from "@/hooks/use-gsap-animation";

export function DynamicContent() {
  useScrollTriggerRefresh([dynamicData]);
  return <>...</>;
}
```

---

## 📊 Comparação: Framer Motion vs GSAP

| Feature | Framer Motion | GSAP |
|---------|---------------|------|
| **Bundle Size** | ~40KB | ~50KB |
| **Parallax** | Bom | Excelente ⭐ |
| **ScrollTrigger** | Básico | Premium ⭐ |
| **Performance** | Muito bom | Excelente ⭐ |
| **Timeline** | Bom | Excelente ⭐ |
| **Morph SVG** | Não | Sim ⭐ |
| **FLIP** | Não | Sim ⭐ |
| **Easings** | Bom | Excelente ⭐ |

**Recomendação:** Use GSAP para **animações complexas e scroll-based**, Framer Motion para **page transitions** e **component animations simples**.

---

## 🎓 Próximos Passos

1. ✅ Componentes criados
2. ✅ Hooks disponíveis
3. 🔲 Implementar em suas páginas
4. 🔲 Testar performance com DevTools
5. 🔲 Refinar timings conforme feedback

---

## 💡 Tips & Tricks

- Use `scrub: 0.6` para scroll-linked animations suaves
- `once: true` previne re-animação ao scroll up
- `stagger: 0.1` é bom padrão para múltiplos elementos
- `duration: 0.8` é bom padrão para reveals
- Combine `useMouseParallax + ParallaxGSAP` para efeitos 3D

---

## 🎬 Referências

- Spector (referência visual): https://spector.framer.website/
- GSAP Docs: https://gsap.com/docs
- ScrollTrigger Docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

---

**Status:** ✅ Implementação Completa
**Próximo:** Integrar em suas páginas e ajustar conforme necessário!
