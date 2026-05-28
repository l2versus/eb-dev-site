import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  evolutionFetch,
  formatWhatsappNumber,
  getEvolutionConfig,
  getEvolutionState,
  saveEvolutionConfig,
} from "@/lib/evolution";

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function publicConfig(config: Awaited<ReturnType<typeof getEvolutionConfig>>) {
  return {
    configured: config.configured,
    source: config.source,
    instance: config.instance,
    apiUrlConfigured: Boolean(config.apiUrl),
    apiKeyConfigured: Boolean(config.apiKey),
    apiUrlPreview: config.apiUrl ? config.apiUrl.replace(/^https?:\/\//, "").replace(/\/.*/, "") : "",
  };
}

export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  const config = await getEvolutionConfig();
  const state = await getEvolutionState(config);

  return NextResponse.json({
    config: publicConfig(config),
    state,
  });
}

export async function PUT(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    await saveEvolutionConfig({
      apiUrl: readString(body.apiUrl),
      apiKey: readString(body.apiKey),
      instance: readString(body.instance),
    });

    const config = await getEvolutionConfig();
    const state = await getEvolutionState(config);

    return NextResponse.json({
      ok: true,
      config: publicConfig(config),
      state,
    });
  } catch (error) {
    console.error("[API Evolution PUT]", error);
    return NextResponse.json({ error: "Erro ao salvar Evolution API" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = readString(body.action);
    const config = await getEvolutionConfig();

    if (!config.configured) {
      return NextResponse.json({ error: "Evolution API nao configurada" }, { status: 400 });
    }

    if (action === "status") {
      return NextResponse.json(await getEvolutionState(config));
    }

    if (action === "connect") {
      const phone = readString(body.phone);
      const number = phone ? `?number=${encodeURIComponent(formatWhatsappNumber(phone))}` : "";
      const data = await evolutionFetch(
        `/instance/connect/${encodeURIComponent(config.instance)}${number}`,
        { method: "GET" },
        config
      );
      return NextResponse.json({ ok: true, action, data });
    }

    if (action === "create") {
      const phone = readString(body.phone);
      const data = await evolutionFetch(
        "/instance/create",
        {
          method: "POST",
          body: JSON.stringify({
            instanceName: config.instance,
            integration: "WHATSAPP-BAILEYS",
            qrcode: true,
            number: phone ? formatWhatsappNumber(phone) : undefined,
            rejectCall: true,
            msgCall: "No momento atendemos por mensagem. Me envia seu briefing por aqui.",
            groupsIgnore: true,
            alwaysOnline: true,
            readMessages: true,
            readStatus: true,
            syncFullHistory: false,
            webhook: {
              url: `${process.env.NEXTAUTH_URL || "https://www.ebdevelop.com.br"}/api/evolution/webhook`,
              byEvents: true,
              base64: false,
              events: ["MESSAGES_UPSERT", "SEND_MESSAGE", "QRCODE_UPDATED", "CONNECTION_UPDATE"],
            },
          }),
        },
        config
      );
      return NextResponse.json({ ok: true, action, data });
    }

    if (action === "restart") {
      const data = await evolutionFetch(
        `/instance/restart/${encodeURIComponent(config.instance)}`,
        { method: "PUT" },
        config
      );
      return NextResponse.json({ ok: true, action, data });
    }

    return NextResponse.json({ error: "Acao invalida" }, { status: 400 });
  } catch (error) {
    console.error("[API Evolution POST]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro na Evolution API" },
      { status: 500 }
    );
  }
}
