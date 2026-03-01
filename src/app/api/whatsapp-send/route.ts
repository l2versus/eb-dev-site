// ══════════════════════════════════════════════════════════════════════════════
// 📱 API — Enviar Mensagem WhatsApp (Evolution API)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Formatar número para padrão WhatsApp
function formatPhone(phone: string): string {
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, "");
  
  // Se já tem 55 no início, retorna
  if (numbers.startsWith("55") && numbers.length >= 12) {
    return numbers;
  }
  
  // Adiciona 55 se não tiver
  if (numbers.length === 11) {
    return `55${numbers}`;
  }
  
  return numbers;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telefone, mensagem, tipo } = body;

    if (!telefone || !mensagem) {
      return NextResponse.json(
        { error: "Telefone e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar configurações do Evolution API
    const config = await prisma.configuracaoFreelancer.findFirst();
    
    const evolutionUrl = config?.evolutionApiUrl || process.env.EVOLUTION_API_URL;
    const evolutionKey = config?.evolutionApiKey || process.env.EVOLUTION_API_KEY;
    const evolutionInstance = config?.evolutionInstance || process.env.EVOLUTION_INSTANCE;

    // Se não tem Evolution API configurada, retorna link do WhatsApp Web
    if (!evolutionUrl || !evolutionKey || !evolutionInstance) {
      const phoneFormatted = formatPhone(telefone);
      const whatsappUrl = `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(mensagem)}`;
      
      return NextResponse.json({
        success: true,
        method: "redirect",
        whatsappUrl,
        message: "Evolution API não configurada. Use o link para enviar.",
      });
    }

    // Enviar via Evolution API
    const phoneFormatted = formatPhone(telefone);
    
    const response = await fetch(
      `${evolutionUrl}/message/sendText/${evolutionInstance}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: evolutionKey,
        },
        body: JSON.stringify({
          number: phoneFormatted,
          text: mensagem,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[Evolution API Error]", error);
      
      // Fallback para link do WhatsApp
      const whatsappUrl = `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(mensagem)}`;
      
      return NextResponse.json({
        success: false,
        method: "redirect",
        whatsappUrl,
        message: "Erro na Evolution API. Use o link para enviar.",
      });
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      method: "api",
      messageId: result.key?.id,
      message: "Mensagem enviada com sucesso!",
    });
  } catch (error) {
    console.error("[API WhatsApp Send]", error);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }
}

// Templates de mensagens
export async function GET() {
  const templates = [
    {
      id: "confirmacao",
      nome: "Confirmação de Reunião",
      mensagem: `Olá {nome}! 👋

Confirmando nossa reunião:
📅 Data: {data}
🕐 Horário: {horario}
📍 Plataforma: {plataforma}

Qualquer dúvida, estou à disposição!

*Emmanuel Bezerra*
Desenvolvedor Full-Stack`,
    },
    {
      id: "lembrete",
      nome: "Lembrete 1h antes",
      mensagem: `Olá {nome}! 👋

Lembrete: nossa reunião começa em 1 hora!
🕐 {horario}
📍 {plataforma}

Até logo!`,
    },
    {
      id: "follow_up",
      nome: "Follow-up Proposta",
      mensagem: `Olá {nome}! 👋

Tudo bem? Estou passando para saber se teve a oportunidade de analisar a proposta que enviei.

Fico à disposição para esclarecer qualquer dúvida!

*Emmanuel Bezerra*`,
    },
    {
      id: "entrega",
      nome: "Aviso de Entrega",
      mensagem: `Olá {nome}! 🎉

Tenho uma ótima notícia! Seu projeto está pronto para visualização:

🔗 Link: {link}

Aguardo seu feedback!

*Emmanuel Bezerra*`,
    },
  ];

  return NextResponse.json(templates);
}
