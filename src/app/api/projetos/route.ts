// ══════════════════════════════════════════════════════════════════════════════
// 📁 API Projetos — CRUD + Kanban Board
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  clienteNome: string;
  clienteEmail: string;
  status: "briefing" | "design" | "desenvolvimento" | "revisao" | "entregue";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  valor: number;
  progresso: number;
  prazo: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── In-memory store ─────────────────────────────────────────────────────────
const projetos: Projeto[] = [];
let seeded = false;

function seedIfEmpty() {
  if (seeded) return;
  seeded = true;

  const agora = new Date();
  const dias = (d: number) => {
    const dt = new Date(agora);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString();
  };

  projetos.push(
    {
      id: "proj-1",
      titulo: "Site Institucional — Café Aroma",
      descricao: "Landing page moderna com cardápio digital, galeria de fotos e integração com Google Maps. Design responsivo e otimizado para SEO.",
      clienteNome: "Café Aroma",
      clienteEmail: "contato@cafearoma.com",
      status: "desenvolvimento",
      prioridade: "alta",
      valor: 4500,
      progresso: 65,
      prazo: dias(12),
      tags: ["Next.js", "Landing Page", "SEO"],
      createdAt: dias(-15),
      updatedAt: agora.toISOString(),
    },
    {
      id: "proj-2",
      titulo: "E-commerce — Tech Solutions",
      descricao: "Loja virtual completa com checkout Mercado Pago, painel admin, gestão de estoque e relatórios de vendas.",
      clienteNome: "Tech Solutions",
      clienteEmail: "contato@techsol.com.br",
      status: "design",
      prioridade: "urgente",
      valor: 12000,
      progresso: 30,
      prazo: dias(25),
      tags: ["E-commerce", "Mercado Pago", "Dashboard"],
      createdAt: dias(-8),
      updatedAt: agora.toISOString(),
    },
    {
      id: "proj-3",
      titulo: "App Agendamento — Myka Procópio",
      descricao: "Sistema web de agendamento online para clínica de estética. Calendário interativo, lembretes por WhatsApp e painel financeiro.",
      clienteNome: "Myka Procópio",
      clienteEmail: "myka@estetica.com",
      status: "revisao",
      prioridade: "media",
      valor: 7800,
      progresso: 90,
      prazo: dias(5),
      tags: ["SaaS", "Agendamento", "WhatsApp"],
      createdAt: dias(-30),
      updatedAt: agora.toISOString(),
    },
    {
      id: "proj-4",
      titulo: "Landing Page — João Silva Advocacia",
      descricao: "Página de captura com formulário de contato, depoimentos de clientes e integração com Google Ads.",
      clienteNome: "João Silva",
      clienteEmail: "joao@advocacia.com",
      status: "entregue",
      prioridade: "baixa",
      valor: 2500,
      progresso: 100,
      prazo: dias(-3),
      tags: ["Landing Page", "Google Ads"],
      createdAt: dias(-45),
      updatedAt: dias(-3),
    },
    {
      id: "proj-5",
      titulo: "Blog + Portfolio — Studio Criativo",
      descricao: "Blog com CMS headless (Sanity), portfolio com animações e dark mode. Deploy automático via Vercel.",
      clienteNome: "Studio Criativo",
      clienteEmail: "hello@studiocriativo.art",
      status: "briefing",
      prioridade: "media",
      valor: 5200,
      progresso: 10,
      prazo: dias(35),
      tags: ["Blog", "CMS", "Animações"],
      createdAt: dias(-2),
      updatedAt: agora.toISOString(),
    },
    {
      id: "proj-6",
      titulo: "Dashboard Analytics — DataViz Corp",
      descricao: "Painel de analytics com gráficos interativos, exportação PDF, filtros avançados e dark theme.",
      clienteNome: "DataViz Corp",
      clienteEmail: "admin@dataviz.io",
      status: "desenvolvimento",
      prioridade: "alta",
      valor: 9500,
      progresso: 45,
      prazo: dias(18),
      tags: ["Dashboard", "Charts", "PDF"],
      createdAt: dias(-12),
      updatedAt: agora.toISOString(),
    }
  );
}

// ─── GET — Listar projetos ───────────────────────────────────────────────────
export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  seedIfEmpty();
  return NextResponse.json(projetos.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
}

// ─── POST — Criar projeto ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  seedIfEmpty();
  const body = await req.json();

  const novo: Projeto = {
    id: `proj-${Date.now()}`,
    titulo: body.titulo || "Novo Projeto",
    descricao: body.descricao || "",
    clienteNome: body.clienteNome || "",
    clienteEmail: body.clienteEmail || "",
    status: body.status || "briefing",
    prioridade: body.prioridade || "media",
    valor: body.valor || 0,
    progresso: body.progresso || 0,
    prazo: body.prazo || new Date(Date.now() + 30 * 86400000).toISOString(),
    tags: body.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projetos.push(novo);
  return NextResponse.json(novo, { status: 201 });
}

// ─── PATCH — Atualizar projeto (inclui mover no kanban) ──────────────────────
export async function PATCH(req: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  seedIfEmpty();
  const body = await req.json();
  const idx = projetos.findIndex((p) => p.id === body.id);

  if (idx === -1) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  const campos = ["titulo", "descricao", "clienteNome", "clienteEmail", "status", "prioridade", "valor", "progresso", "prazo", "tags"];
  for (const campo of campos) {
    if (body[campo] !== undefined) {
      (projetos[idx] as any)[campo] = body[campo];
    }
  }
  projetos[idx].updatedAt = new Date().toISOString();

  return NextResponse.json(projetos[idx]);
}

// ─── DELETE — Remover projeto ────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  seedIfEmpty();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const idx = projetos.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  projetos.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
