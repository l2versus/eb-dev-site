import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { TipoProjeto } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const projectTypeMap: Record<string, TipoProjeto> = {
  landing: TipoProjeto.LANDING_PAGE,
  institucional: TipoProjeto.SITE_INSTITUCIONAL,
  ecommerce: TipoProjeto.ECOMMERCE,
  webapp: TipoProjeto.WEBAPP,
  mobile: TipoProjeto.WEBAPP,
};

const projectLabels: Record<string, string> = {
  landing: "Landing Page",
  institucional: "Site Institucional",
  ecommerce: "E-commerce",
  webapp: "Web App / SaaS",
  mobile: "App Mobile",
};

const addonLabels: Record<string, string> = {
  chatbot: "Chatbot com IA",
  analytics: "Dashboard Analytics",
  schedule: "Sistema de Agendamento",
  payments: "Integracao Pagamentos",
  seo: "SEO Avancado",
  manutencao: "Manutencao Mensal",
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => readString(item)).filter(Boolean)
    : [];
}

function readMoney(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function gerarCodigoAcesso() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData = (body.formData ?? {}) as Record<string, unknown>;

    const nome = readString(formData.name);
    const email = readString(formData.email).toLowerCase();
    const telefone = readString(formData.phone);
    const empresa = readString(formData.company);
    const descricao = readString(formData.description);
    const budget = readString(formData.budget);
    const deadline = readString(formData.deadline);
    const selectedTypes = readStringArray(body.selectedTypes);
    const selectedAddons = readStringArray(body.selectedAddons);
    const estimatedTotal = readMoney(body.estimatedTotal);

    if (!nome || !email || !telefone || !descricao || selectedTypes.length === 0) {
      return NextResponse.json(
        { error: "Dados obrigatorios ausentes." },
        { status: 400 }
      );
    }

    const tipoProjeto = projectTypeMap[selectedTypes[0]] || TipoProjeto.OUTRO;
    const servicos = selectedTypes.map((id) => projectLabels[id] || id);
    const adicionais = selectedAddons.map((id) => addonLabels[id] || id);
    const titulo = `Orcamento: ${servicos.join(", ")}`;
    const valorInicial = estimatedTotal || 1;
    const validade = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    const cliente = await prisma.cliente.upsert({
      where: { email },
      update: {
        nome,
        telefone,
        empresa: empresa || null,
        tipo: empresa ? "PJ" : "PF",
        status: "NEGOCIANDO",
        origemLead: "orcamento-site",
        notas: descricao,
        ultimoContato: new Date(),
      },
      create: {
        nome,
        email,
        telefone,
        empresa: empresa || null,
        tipo: empresa ? "PJ" : "PF",
        status: "NEGOCIANDO",
        origemLead: "orcamento-site",
        notas: descricao,
        ultimoContato: new Date(),
      },
    });

    const proposta = await prisma.proposta.create({
      data: {
        clienteId: cliente.id,
        titulo,
        subtitulo: "Solicitacao enviada pelo site",
        chamadaPrincipal: "Lead solicitou um orcamento pelo formulario publico.",
        descricao,
        valor: valorInicial,
        desconto: 0,
        valorFinal: valorInicial,
        moeda: "BRL",
        tipoProjeto,
        prazoEstimado: deadline || null,
        itensInclusos: [...servicos, ...adicionais],
        escopoDetalhado: {
          servicos,
          adicionais,
          budget,
          deadline,
          estimatedTotal,
        },
        observacoes: [
          budget ? `Orcamento informado: ${budget}` : null,
          deadline ? `Prazo desejado: ${deadline}` : null,
          telefone ? `WhatsApp: ${telefone}` : null,
        ].filter(Boolean).join("\n"),
        validade,
        status: "PENDENTE",
        geradaPorIA: false,
        briefingIA: descricao,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            empresa: true,
          },
        },
      },
    });

    const acesso = await prisma.acessoCliente.upsert({
      where: { clienteId: cliente.id },
      update: {
        ativo: true,
      },
      create: {
        clienteId: cliente.id,
        codigoAcesso: gerarCodigoAcesso(),
      },
    });

    return NextResponse.json({ cliente, proposta, acesso }, { status: 201 });
  } catch (error) {
    console.error("[API Orcamentos POST]", error);
    return NextResponse.json(
      { error: "Erro ao salvar orcamento." },
      { status: 500 }
    );
  }
}
