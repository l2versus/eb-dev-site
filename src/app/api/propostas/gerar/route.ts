// ══════════════════════════════════════════════════════════════════════════════
// 🤖 API — Geração de Proposta via Claude (Anthropic)
// POST recebe briefing em texto livre, retorna JSON estruturado pronto pra edição
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAdmin } from "@/lib/api-auth";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Você é Emmanuel Bezerra (EB Develop), desenvolvedor full-stack freelance. Sua missão: transformar briefings curtos em propostas comerciais detalhadas, elegantes e prontas pra fechar venda.

TOM: profissional-premium, direto, focado em valor. Nada de jargão técnico vazio. Cada linha precisa justificar investimento.

ESTRUTURA OBRIGATÓRIA da proposta gerada:
- titulo: headline impactante (ex: "Ecossistema Digital Inteligente para [Empresa]")
- subtitulo: 1 linha de posicionamento (ex: "CRM + IA Omnichannel + Painel Financeiro")
- chamadaPrincipal: 2-3 linhas explicando o que o cliente vai receber
- descricao: contexto do projeto em 1 parágrafo
- valor: número inteiro em BRL (ou USD se o cliente for internacional)
- moeda: "BRL" ou "USD"
- parcelamento: string (ex: "12x R$1.700 no cartão" ou "50% na assinatura + 50% na entrega")
- custoMensalRecorrente: número OU null (só se houver mensalidade real)
- prazoEstimado: string (ex: "4 semanas", "15-30 dias úteis")
- validadeDias: número (default 15)
- tipoProjeto: um de ["SITE", "SISTEMA", "APP_MOBILE", "LANDING_PAGE", "ECOMMERCE", "OUTRO"]
- itensInclusos: array de strings curtas (6-10 itens, ex: "Site premium com SEO", "CRM multi-pipeline")
- escopoDetalhado: array de {titulo, descricao} — 3-6 blocos aprofundados dos itens principais
- cronograma: array de {semana, entrega, status} — onde status é "pendente" por padrão
- custosOperacionais: array de {servico, descricao, custoEstimado} — ex: VPS, IA API, domínio
- comparativo: array de {funcionalidade, antes, depois} — 4-6 linhas mostrando ganho
- upgradesFuturos: array de {titulo, descricao} — 3-5 features pra fase 2

ESTILO EM PORTUGUÊS BR, sem emojis em títulos, com clareza total. Adapte valor e complexidade ao briefing:
- Landing simples: R$800-2.500, 5-10 dias
- Site + painel: R$3.500-8.000, 2-4 semanas
- SaaS completo: R$15.000-40.000, 4-8 semanas
- Enterprise/IA omnichannel: R$30.000+, 6-8 semanas

Retorne APENAS a ferramenta gerar_proposta com todos os campos preenchidos. Sem texto fora da ferramenta.`;

const GERAR_PROPOSTA_TOOL = {
  name: "gerar_proposta",
  description: "Retorna a proposta comercial estruturada baseada no briefing do usuário",
  input_schema: {
    type: "object" as const,
    properties: {
      titulo: { type: "string" },
      subtitulo: { type: "string" },
      chamadaPrincipal: { type: "string" },
      descricao: { type: "string" },
      valor: { type: "number" },
      moeda: { type: "string", enum: ["BRL", "USD"] },
      parcelamento: { type: "string" },
      custoMensalRecorrente: { type: ["number", "null"] },
      prazoEstimado: { type: "string" },
      validadeDias: { type: "number" },
      tipoProjeto: {
        type: "string",
        enum: ["SITE", "SISTEMA", "APP_MOBILE", "LANDING_PAGE", "ECOMMERCE", "OUTRO"],
      },
      itensInclusos: {
        type: "array",
        items: { type: "string" },
      },
      escopoDetalhado: {
        type: "array",
        items: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            descricao: { type: "string" },
          },
          required: ["titulo", "descricao"],
        },
      },
      cronograma: {
        type: "array",
        items: {
          type: "object",
          properties: {
            semana: { type: "string" },
            entrega: { type: "string" },
            status: { type: "string", enum: ["pendente", "em_andamento", "concluido"] },
          },
          required: ["semana", "entrega", "status"],
        },
      },
      custosOperacionais: {
        type: "array",
        items: {
          type: "object",
          properties: {
            servico: { type: "string" },
            descricao: { type: "string" },
            custoEstimado: { type: "string" },
          },
          required: ["servico", "descricao", "custoEstimado"],
        },
      },
      comparativo: {
        type: "array",
        items: {
          type: "object",
          properties: {
            funcionalidade: { type: "string" },
            antes: { type: "string" },
            depois: { type: "string" },
          },
          required: ["funcionalidade", "antes", "depois"],
        },
      },
      upgradesFuturos: {
        type: "array",
        items: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            descricao: { type: "string" },
          },
          required: ["titulo", "descricao"],
        },
      },
    },
    required: [
      "titulo",
      "subtitulo",
      "chamadaPrincipal",
      "descricao",
      "valor",
      "moeda",
      "parcelamento",
      "prazoEstimado",
      "validadeDias",
      "tipoProjeto",
      "itensInclusos",
      "escopoDetalhado",
      "cronograma",
      "custosOperacionais",
      "comparativo",
      "upgradesFuturos",
    ],
  },
};

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY não configurada" },
      { status: 500 }
    );
  }

  try {
    const { briefing } = await request.json();

    if (!briefing || typeof briefing !== "string" || briefing.trim().length < 20) {
      return NextResponse.json(
        { error: "Briefing deve ter ao menos 20 caracteres descrevendo o projeto." },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [GERAR_PROPOSTA_TOOL],
      tool_choice: { type: "tool", name: "gerar_proposta" },
      messages: [
        {
          role: "user",
          content: `Briefing do projeto:\n\n${briefing.trim()}\n\nGere a proposta completa.`,
        },
      ],
    });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json(
        { error: "Claude não retornou proposta estruturada." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      proposta: toolUse.input,
      usage: {
        input: response.usage.input_tokens,
        cached: response.usage.cache_read_input_tokens ?? 0,
        output: response.usage.output_tokens,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao gerar proposta";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
