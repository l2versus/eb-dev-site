// ══════════════════════════════════════════════════════════════════════════════
// 👀 Visitor Notify API — Notifica via WhatsApp quando alguém acessa o site
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

const EVOLUTION_API_URL = process.env.WHATSAPP_API_URL || "";
const EVOLUTION_API_KEY = process.env.WHATSAPP_API_KEY || "";
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || "emmanuel-clinica";
const OWNER_PHONE = process.env.OWNER_WHATSAPP || "5585999999999"; // Seu número

// Rate limiting - evita spam de notificações
const recentVisitors = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutos entre notificações do mesmo IP

// ─── Função para enviar WhatsApp ─────────────────────────────────────────────

async function enviarWhatsApp(telefone: string, mensagem: string) {
  const numero = telefone.replace(/\D/g, "");
  const telInternacional = numero.startsWith("55") ? numero : `55${numero}`;

  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: `${telInternacional}@s.whatsapp.net`,
          text: mensagem,
        }),
      }
    );

    if (!response.ok) {
      console.error("WhatsApp API Error:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return false;
  }
}

// ─── POST Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Obter IP do visitante
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    // Rate limiting por IP
    const lastVisit = recentVisitors.get(ip);
    if (lastVisit && Date.now() - lastVisit < COOLDOWN_MS) {
      return NextResponse.json({ ok: true, throttled: true });
    }

    // Registrar visita
    recentVisitors.set(ip, Date.now());

    // Limpar IPs antigos (evita memory leak)
    const now = Date.now();
    for (const [key, time] of recentVisitors.entries()) {
      if (now - time > COOLDOWN_MS * 2) {
        recentVisitors.delete(key);
      }
    }

    // Dados da requisição
    const body = await request.json().catch(() => ({}));
    const {
      page = "Home",
      referrer = "Direto",
      userAgent = "Unknown",
      screenSize = "Unknown",
      city = "",
      country = "",
    } = body;

    // Detectar device
    const isMobile = /mobile|android|iphone/i.test(userAgent);
    const deviceEmoji = isMobile ? "📱" : "💻";
    const browser = userAgent.includes("Chrome")
      ? "Chrome"
      : userAgent.includes("Firefox")
      ? "Firefox"
      : userAgent.includes("Safari")
      ? "Safari"
      : userAgent.includes("Edge")
      ? "Edge"
      : "Outro";

    // Formatar hora de Brasília
    const horaFormatada = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Fortaleza",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Montar mensagem
    const msg =
      `🔔 *Nova Visita no Site!*\n\n` +
      `${deviceEmoji} *Dispositivo:* ${isMobile ? "Mobile" : "Desktop"}\n` +
      `🌐 *Navegador:* ${browser}\n` +
      `📄 *Página:* ${page}\n` +
      `🔗 *Origem:* ${referrer === "" ? "Direto" : referrer}\n` +
      `📐 *Tela:* ${screenSize}\n` +
      (city ? `📍 *Localização:* ${city}${country ? `, ${country}` : ""}\n` : "") +
      `⏰ *Horário:* ${horaFormatada}\n\n` +
      `_eb-dev.vercel.app_ 🚀`;

    // Enviar notificação (não bloquear resposta)
    if (EVOLUTION_API_URL && EVOLUTION_API_KEY) {
      enviarWhatsApp(OWNER_PHONE, msg).catch(console.error);
    }

    return NextResponse.json({ ok: true, notified: true });
  } catch (error) {
    console.error("Visitor notify error:", error);
    return NextResponse.json({ ok: true, error: true });
  }
}

// ─── GET Handler (para testes) ───────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({
    status: "Visitor Notify API OK",
    info: "POST para registrar visita e notificar via WhatsApp",
  });
}
