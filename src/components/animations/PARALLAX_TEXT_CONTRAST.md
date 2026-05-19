# 🎨 Parallax Text Contrast — O Efeito Que Você Descreveu

## ❌ O Problema (Estava Quebrado)

Você descreveu um efeito onde:
- ❌ Texto se move "indo e voltando"
- ❌ Contraste de cores "encosta"
- ❌ Tem um blur/desfoque que desaparece
- ❌ **Nome do efeito:** Parallax Text with Contrast/Blur Shift

---

## ✅ A Solução (CONSERTADO!)

### **Componente:** `ParallaxTextContrast`

Este componente cria EXATAMENTE o efeito que você quer:

```tsx
import { ParallaxTextContrast } from "@/components/animations";

// Use na sua página marketing
<ParallaxTextContrast
  text="Emmanuel Bezerra"
  className="text-7xl md:text-8xl font-bold text-center"
  textClassName="text-orange-400"
  blurStart={15}      // Começa com 15px de blur
  blurEnd={0}         // Termina totalmente nítido
  scale={1.2}         // Intensidade do movimento paralax
/>
```

---

## 🎯 Como Funciona

### Progresso do Efeito (Conforme Scroll)

```
0%      →  50%      →  100%
Blur    →  Nítido   →  Blur
Desfoque   Contraste    Desfoque
(indo)     (volta)      (indo)
```

### O que Muda

| Propriedade | Início | Meio | Fim |
|---|---|---|---|
| **Blur** | 15px | 0px | 15px |
| **Contrast** | 0.8 | 1.2 | 0.8 |
| **Position X** | -100px | 0px | +100px |
| **Opacity** | 0.7 | 1.0 | 0.7 |

---

## 🔧 Props Explicadas

| Prop | Tipo | Default | O que faz |
|---|---|---|---|
| `text` | string | - | Texto que será animado |
| `className` | string | `text-7xl md:text-8xl font-bold` | Classes do texto |
| `textClassName` | string | `text-orange-400` | Cor do texto |
| `blurStart` | number | 15 | Blur inicial (px) |
| `blurEnd` | number | 0 | Blur final (px) |
| `scale` | number | 1 | Intensidade do parallax |
| `markers` | boolean | false | Debug (mostra pontos de ativação) |

---

## 📝 Exemplos de Uso

### Exemplo 1: Hero Section
```tsx
<ParallaxTextContrast
  text="Emmanuel Bezerra"
  blurStart={20}
  blurEnd={0}
  scale={1.5}
  className="text-8xl font-bold text-center"
  textClassName="text-orange-400"
/>
```

### Exemplo 2: Section Title (Mais Sutil)
```tsx
<ParallaxTextContrast
  text="Seus Projetos Merecem Excelência"
  blurStart={8}
  blurEnd={0}
  scale={0.8}
  className="text-5xl font-bold"
  textClassName="text-white"
/>
```

### Exemplo 3: Com Debug (Para Ver Funcionando)
```tsx
<ParallaxTextContrast
  text="Teste o efeito"
  markers={true}  // ← Mostra pontos de ativação
  blurStart={15}
  blurEnd={0}
/>
```

---

## 🎨 Variações do Efeito

### Variação 1: Múltiplas Linhas (Cascata)
```tsx
<ParallaxTextMultiline
  lines={[
    "Escolha",
    "a",
    "escala",
    "perfeita"
  ]}
/>
```

### Variação 2: Apenas Contraste (Sem Parallax)
```tsx
<ContrastShift
  contrastStart={0.5}
  contrastEnd={1.3}
  brightnessStart={0.8}
  brightnessEnd={1.1}
>
  <h2>Seu Texto Aqui</h2>
</ContrastShift>
```

### Variação 3: Blurred Reveal Puro
```tsx
<BlurredReveal
  text="Começa desfocado e fica nítido"
  blurAmount={20}
/>
```

### Variação 4: Cores Morphing + Parallax
```tsx
<MorphingColorParallax
  text="PREMIUM"
  colors={["#FFB84D", "#FF7A5C", "#FF3D5A", "#C13A7D"]}
/>
```

---

## 🎬 Como Integrar na Sua Página

### Passo 1: Importe o componente
```tsx
import { ParallaxTextContrast } from "@/components/animations";
```

### Passo 2: Use na sua página
```tsx
// Em src/app/(marketing)/page.tsx

export default function Home() {
  return (
    <div>
      {/* Hero existente */}
      
      {/* Seção com novo efeito */}
      <section className="py-32 bg-dark-950">
        <ParallaxTextContrast
          text="Transformar Negócios em Histórias de Sucesso"
          blurStart={15}
          blurEnd={0}
          scale={1.2}
          className="text-6xl md:text-7xl font-bold text-center max-w-4xl mx-auto"
          textClassName="text-orange-400"
        />
      </section>
      
      {/* Resto da página */}
    </div>
  );
}
```

---

## 🚀 Performance

✅ **Otimizado com GSAP ScrollTrigger:**
- Usa `will-change: transform`
- Batching de animações
- Limpeza automática de timelines
- Sem memory leaks

---

## 🎯 Quick Copy-Paste

### Para seu Hero (Máximo Impacto)
```tsx
<ParallaxTextContrast
  text="Emmanuel Bezerra"
  blurStart={20}
  blurEnd={0}
  scale={1.4}
  className="text-8xl md:text-9xl font-bold text-center leading-tight"
  textClassName="text-orange-400 drop-shadow-2xl"
/>
```

### Para Seção de Produtos
```tsx
<ParallaxTextContrast
  text="Serviços Personalizados"
  blurStart={10}
  blurEnd={0}
  scale={0.9}
  className="text-6xl font-bold text-center"
  textClassName="text-white"
/>
```

---

## 🎓 Explicação Técnica

### Por Trás das Cortinas

```javascript
// GSAP ScrollTrigger calcula o progresso (0-1)
// e aplica transformações suaves:

progress: 0.0 → blur: 15px, x: -100px, contrast: 0.8
progress: 0.5 → blur: 0px,  x: 0px,    contrast: 1.2  ← PICO
progress: 1.0 → blur: 15px, x: +100px, contrast: 0.8

// Usa Math.sin(progress * PI) para movimento "ir-e-voltar"
// Interpola blur, contraste e position suavemente
// Scrub: 0.8 = suavidade de 800ms entre frames
```

---

## ✨ Status

✅ Implementado
✅ Otimizado
✅ Pronto para Produção
✅ Com múltiplas variações

---

**Próximo Passo:** Use-o na sua página e ajuste os valores de blur/scale conforme preferência!
