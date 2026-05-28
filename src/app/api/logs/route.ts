import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

type Categoria = "projeto" | "financeiro" | "chat" | "proposta" | "config" | "agenda" | "cliente" | "sistema" | "auth";
type Nivel = "info" | "success" | "warning" | "error";

interface LogEntry {
  id: string;
  timestamp: string;
  categoria: Categoria;
  nivel: Nivel;
  acao: string;
  descricao: string;
  usuario: string;
  detalhes?: string;
}

export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const [clientes, propostas, projetos, transacoes, compromissos, mensagens] = await Promise.all([
      prisma.cliente.findMany({ orderBy: { updatedAt: "desc" }, take: 20 }),
      prisma.proposta.findMany({ orderBy: { updatedAt: "desc" }, take: 20, include: { cliente: true } }),
      prisma.projeto.findMany({ orderBy: { updatedAt: "desc" }, take: 20, include: { cliente: true } }),
      prisma.transacao.findMany({ orderBy: { updatedAt: "desc" }, take: 20 }),
      prisma.compromisso.findMany({ orderBy: { updatedAt: "desc" }, take: 20, include: { cliente: true } }),
      prisma.chatMensagem.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { conversa: true } }),
    ]);

    const logs: LogEntry[] = [
      ...clientes.map((cliente) => ({
        id: `cliente-${cliente.id}`,
        timestamp: cliente.updatedAt.toISOString(),
        categoria: "cliente" as Categoria,
        nivel: "success" as Nivel,
        acao: cliente.createdAt.getTime() === cliente.updatedAt.getTime() ? "Cliente criado" : "Cliente atualizado",
        descricao: `${cliente.nome} - ${cliente.status}`,
        usuario: cliente.origemLead === "orcamento-site" ? "Site" : "Admin",
        detalhes: cliente.email,
      })),
      ...propostas.map((proposta) => ({
        id: `proposta-${proposta.id}`,
        timestamp: proposta.updatedAt.toISOString(),
        categoria: "proposta" as Categoria,
        nivel: proposta.status === "RECUSADA" ? "warning" as Nivel : "success" as Nivel,
        acao: `Proposta ${proposta.status.toLowerCase()}`,
        descricao: `${proposta.titulo} - ${proposta.cliente.nome}`,
        usuario: proposta.geradaPorIA ? "IA" : "Admin",
        detalhes: `Valor final: R$ ${Number(proposta.valorFinal).toLocaleString("pt-BR")}`,
      })),
      ...projetos.map((projeto) => ({
        id: `projeto-${projeto.id}`,
        timestamp: projeto.updatedAt.toISOString(),
        categoria: "projeto" as Categoria,
        nivel: projeto.status === "ENTREGUE" ? "success" as Nivel : "info" as Nivel,
        acao: `Projeto ${projeto.status.toLowerCase()}`,
        descricao: `${projeto.nome} - ${projeto.cliente.nome}`,
        usuario: "Admin",
        detalhes: `Progresso: ${projeto.progresso}%`,
      })),
      ...transacoes.map((transacao) => ({
        id: `financeiro-${transacao.id}`,
        timestamp: transacao.updatedAt.toISOString(),
        categoria: "financeiro" as Categoria,
        nivel: transacao.status === "ATRASADO" ? "warning" as Nivel : "success" as Nivel,
        acao: `${transacao.tipo.toLowerCase()} ${transacao.status.toLowerCase()}`,
        descricao: transacao.descricao,
        usuario: "Admin",
        detalhes: `R$ ${Number(transacao.valor).toLocaleString("pt-BR")} - ${transacao.categoria}`,
      })),
      ...compromissos.map((compromisso) => ({
        id: `agenda-${compromisso.id}`,
        timestamp: compromisso.updatedAt.toISOString(),
        categoria: "agenda" as Categoria,
        nivel: compromisso.status === "CANCELADO" ? "warning" as Nivel : "info" as Nivel,
        acao: `Compromisso ${compromisso.status.toLowerCase()}`,
        descricao: compromisso.titulo,
        usuario: "Admin",
        detalhes: compromisso.cliente?.nome || compromisso.plataforma || undefined,
      })),
      ...mensagens.map((mensagem) => ({
        id: `chat-${mensagem.id}`,
        timestamp: mensagem.createdAt.toISOString(),
        categoria: "chat" as Categoria,
        nivel: "info" as Nivel,
        acao: mensagem.remetente === "admin" ? "Mensagem enviada" : "Mensagem recebida",
        descricao: mensagem.conteudo.slice(0, 120),
        usuario: mensagem.remetenteNome,
        detalhes: mensagem.conversa.clienteNome,
      })),
    ];

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(logs.slice(0, 80));
  } catch (error) {
    console.error("[API Logs GET]", error);
    return NextResponse.json({ error: "Erro ao buscar logs" }, { status: 500 });
  }
}
