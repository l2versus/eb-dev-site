// ══════════════════════════════════════════════════════════════════════════════
// 🤖 Chatbot API — EB Dev Assistant (NLP + respostas inteligentes)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

// ─── Intenções e keywords ───────────────────────────────────────────────────

interface IntencaoConfig {
  keywords: string[];
  resposta: string;
  sugestoes: string[];
}

const intencoes: Record<string, IntencaoConfig> = {
  saudacao: {
    keywords: ["oi", "olá", "ola", "hey", "hello", "bom dia", "boa tarde", "boa noite", "e aí", "eae", "salve", "fala"],
    resposta: "Olá! 👋 Sou o assistente virtual do Emmanuel Bezerra, desenvolvedor Full-Stack. Como posso te ajudar?\n\n💡 Posso falar sobre:\n• Serviços e tecnologias\n• Orçamento e valores\n• Projetos realizados\n• Prazo de entrega",
    sugestoes: ["Quais serviços?", "Quanto custa?", "Ver projetos", "Prazo de entrega"],
  },
  servicos: {
    keywords: ["serviço", "servicos", "serviços", "faz", "fazem", "trabalho", "tipo de projeto", "o que desenvolve", "que voce faz", "que você faz", "cria", "desenvolve"],
    resposta: "Desenvolvemos soluções web completas! 🚀\n\n🔹 **Landing Pages** — Sites institucionais e de conversão\n🔹 **Aplicações Web (SaaS)** — Sistemas completos com login, dashboard, pagamentos\n🔹 **E-commerce** — Lojas virtuais com checkout e gestão\n🔹 **Sistemas & Dashboards** — Painéis administrativos e de gestão\n🔹 **APIs & Integrações** — WhatsApp, Mercado Pago, PIX, etc\n🔹 **Consultoria** — Análise e planejamento técnico\n\nQuer saber o valor de algum?",
    sugestoes: ["Quanto custa?", "Ver projetos", "Tecnologias usadas", "Prazo de entrega"],
  },
  precos: {
    keywords: ["preço", "preco", "valor", "custa", "custo", "quanto", "orçamento", "orcamento", "investimento", "budget", "tabela", "plano", "planos"],
    resposta: "Nossos planos começam a partir de R$ 1.000! 💰\n\n📋 **Starter** (R$ 1.000 - R$ 2.500)\nLanding page profissional, 1-3 páginas\n\n🚀 **Profissional** (R$ 3.000 - R$ 7.000)\nSite completo com painel admin\n\n💎 **Enterprise** (R$ 8.000 - R$ 20.000)\nSistema SaaS completo com tudo integrado\n\n👉 Acesse /orcamento para ver detalhes completos ou me conte seu projeto que faço um orçamento personalizado!",
    sugestoes: ["Ver planos detalhados", "Quero Starter", "Quero Enterprise", "Falar no WhatsApp"],
  },
  tecnologias: {
    keywords: ["tecnologia", "tecnologias", "stack", "linguagem", "framework", "react", "next", "node", "python", "banco de dados", "ferramenta"],
    resposta: "Nossa stack é moderna e robusta! ⚡\n\n**Frontend:**\n• React / Next.js — Interface rápida e SEO\n• TypeScript — Código seguro\n• Tailwind CSS — Design responsivo\n\n**Backend:**\n• Node.js / Python — Servidor performático\n• PostgreSQL + Prisma — Banco de dados confiável\n\n**DevOps:**\n• Docker — Deploy consistente\n• AWS / Vercel — Hospedagem escalável\n\nTudo isso junto = site rápido, bonito e seguro! 🔒",
    sugestoes: ["Quanto custa?", "Ver projetos", "O que é React?", "Quero um orçamento"],
  },
  projetos: {
    keywords: ["projeto", "projetos", "portfolio", "portfólio", "exemplo", "já fez", "trabalhos", "case", "ricardo", "rautenberg", "imovel", "imóvel", "corretor", "estetica", "estética", "myka"],
    resposta: "Confira nossos projetos em destaque! 🎯\n\n🏙️ **Ricardo Rautenberg** — Portfólio digital premium para corretor de imóveis de luxo em SP. Filtros avançados, modo off-market e painel admin completo.\n→ ricardorautenberg.com.br\n\n💆 **Myka Procópio** — SaaS completo para clínica de estética: agendamento, pagamentos PIX, chatbot IA e dashboard financeiro.\n\nRole até a seção Projetos para ver mais detalhes e screenshots! 👇",
    sugestoes: ["Quanto custa algo assim?", "Quero algo parecido", "Ver tecnologias", "Falar no WhatsApp"],
  },
  prazo: {
    keywords: ["prazo", "tempo", "demora", "entrega", "quando fica pronto", "dias", "semanas", "meses", "rápido", "urgente"],
    resposta: "Prazos estimados por tipo de projeto: ⏰\n\n⚡ **Landing Page** — 1 a 2 semanas\n🔧 **Site com painel** — 3 a 5 semanas\n🏗️ **Sistema SaaS completo** — 6 a 12 semanas\n\nProjetos urgentes? Temos taxa de prioridade para entregas aceleradas! 🚀\n\nMe conte sobre seu projeto e dou uma estimativa mais precisa.",
    sugestoes: ["Quanto custa?", "Tenho urgência", "Ver projetos", "Falar no WhatsApp"],
  },
  contato: {
    keywords: ["contato", "whatsapp", "zap", "email", "telefone", "falar", "chamar", "conversar", "mensagem", "ligar"],
    resposta: "Entre em contato! 📱\n\n📞 **WhatsApp:** (85) 99850-0344\n📧 **Email:** emmanuelbezerra1992@gmail.com\n📸 **Instagram:** @emmanuelbezerra_\n💻 **GitHub:** /emmanuelbezerradev\n\n👇 Ou clique aqui para ir direto pro WhatsApp:\nwa.me/5585998500344",
    sugestoes: ["WhatsApp direto", "Ver serviços", "Orçamento", "Ver projetos"],
  },
  pagamento: {
    keywords: ["pagamento", "pagar", "parcela", "parcelamento", "pix", "cartão", "cartao", "boleto", "como pago"],
    resposta: "Formas de pagamento flexíveis! 💳\n\n✅ **PIX** — 5% de desconto\n✅ **Cartão de crédito** — Até 12x\n✅ **Transferência** — TED/DOC\n✅ **50/50** — Metade no início, metade na entrega\n\nPara projetos maiores, fazemos um cronograma de pagamento personalizado! 📋",
    sugestoes: ["Ver planos", "Quero orçamento", "Falar no WhatsApp"],
  },
  garantia: {
    keywords: ["garantia", "suporte", "manutenção", "manutencao", "bug", "problema", "pós", "pos", "depois"],
    resposta: "Trabalhamos com garantia e suporte! 🛡️\n\n✅ **30 dias de garantia** contra bugs em todos os planos\n✅ **Suporte técnico** no período de garantia\n✅ **Código fonte** entregue — o projeto é 100% seu\n✅ **Documentação** de como usar o sistema\n\nPlanos de manutenção mensal disponíveis a partir de R$ 300/mês.",
    sugestoes: ["Ver planos", "Quanto custa manutenção?", "Falar no WhatsApp"],
  },
  despedida: {
    keywords: ["tchau", "bye", "até", "ate", "valeu", "obrigado", "obrigada", "vlw", "flw", "thanks"],
    resposta: "Até mais! 👋 Foi um prazer ajudar. Qualquer dúvida sobre desenvolvimento web, é só chamar!\n\n🚀 Emmanuel Bezerra — Full-Stack Developer\n📱 WhatsApp: (85) 99850-0344",
    sugestoes: ["Voltar ao início", "WhatsApp direto"],
  },
};

const respostaPadrao: IntencaoConfig = {
  keywords: [],
  resposta: "Hmm, não entendi bem. 🤔 Posso te ajudar com:\n\n• 💼 **Serviços** — O que desenvolvemos\n• 💰 **Orçamento** — Valores e planos\n• 🎯 **Projetos** — Cases de sucesso\n• ⚡ **Tecnologias** — Nossa stack\n• ⏰ **Prazos** — Tempo de entrega\n• 📱 **Contato** — WhatsApp e email\n\nDigite sua dúvida ou clique em uma sugestão!",
  sugestoes: ["Serviços", "Quanto custa?", "Ver projetos", "WhatsApp"],
};

function detectarIntencao(msg: string): IntencaoConfig {
  const normalizado = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  for (const [, config] of Object.entries(intencoes)) {
    for (const kw of config.keywords) {
      const kwNorm = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalizado.includes(kwNorm)) {
        return config;
      }
    }
  }
  return respostaPadrao;
}

// ─── Rate limit simples ─────────────────────────────────────────────────────
const chatRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkChatRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = chatRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    chatRateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

// ─── Handler ────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (!checkChatRateLimit(ip)) {
      return NextResponse.json(
        { error: "Muitas mensagens. Aguarde um momento." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.slice(0, 500) : "";

    if (!message.trim()) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    const resultado = detectarIntencao(message);

    return NextResponse.json({
      resposta: resultado.resposta,
      sugestoes: resultado.sugestoes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CHATBOT] Erro:", error);
    return NextResponse.json(
      {
        resposta: "Ops, tive um probleminha técnico! 😅 Tente novamente em instantes.",
        sugestoes: ["Tentar novamente"],
      },
      { status: 500 }
    );
  }
}
