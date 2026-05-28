import { prisma } from "@/lib/prisma";

export interface EvolutionConfig {
  apiUrl: string;
  apiKey: string;
  instance: string;
  configured: boolean;
  source: "database" | "environment" | "empty";
}

export interface EvolutionSendResult {
  success: boolean;
  method: "api" | "redirect";
  configured: boolean;
  whatsappUrl: string;
  message?: string;
  messageId?: string;
  raw?: unknown;
}

const DEFAULT_INSTANCE = "emmanuel-crm";

function clean(value: string | null | undefined) {
  return (value || "").trim().replace(/\/+$/, "");
}

export function formatWhatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function whatsappUrl(phone: string, message: string) {
  return `https://wa.me/${formatWhatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}

export async function getEvolutionConfig(): Promise<EvolutionConfig> {
  const config = await prisma.configuracaoFreelancer.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      evolutionApiUrl: true,
      evolutionApiKey: true,
      evolutionInstance: true,
    },
  });

  const dbUrl = clean(config?.evolutionApiUrl);
  const dbKey = clean(config?.evolutionApiKey);
  const dbInstance = clean(config?.evolutionInstance);
  const envUrl = clean(process.env.EVOLUTION_API_URL || process.env.WHATSAPP_API_URL);
  const envKey = clean(process.env.EVOLUTION_API_KEY || process.env.WHATSAPP_API_KEY);
  const envInstance = clean(
    process.env.EVOLUTION_INSTANCE ||
      process.env.WHATSAPP_INSTANCE ||
      process.env.WHATSAPP_INSTANCE_ID
  );

  const apiUrl = dbUrl || envUrl;
  const apiKey = dbKey || envKey;
  const instance = dbInstance || envInstance || DEFAULT_INSTANCE;

  return {
    apiUrl,
    apiKey,
    instance,
    configured: Boolean(apiUrl && apiKey && instance),
    source: dbUrl || dbKey || dbInstance ? "database" : apiUrl || apiKey ? "environment" : "empty",
  };
}

export async function saveEvolutionConfig(input: {
  apiUrl?: string;
  apiKey?: string;
  instance?: string;
}) {
  const existing = await prisma.configuracaoFreelancer.findFirst({
    orderBy: { createdAt: "asc" },
  });

  const data = {
    evolutionApiUrl: clean(input.apiUrl) || existing?.evolutionApiUrl || null,
    evolutionApiKey: clean(input.apiKey) || existing?.evolutionApiKey || null,
    evolutionInstance: clean(input.instance) || existing?.evolutionInstance || DEFAULT_INSTANCE,
  };

  if (existing) {
    return prisma.configuracaoFreelancer.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.configuracaoFreelancer.create({
    data: {
      ...data,
      nomeCompleto: "Emmanuel Bezerra",
      titulo: "Desenvolvedor Full-Stack",
    },
  });
}

export async function evolutionFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
  config?: EvolutionConfig
) {
  const current = config || (await getEvolutionConfig());
  if (!current.configured) {
    throw new Error("Evolution API nao configurada");
  }

  const response = await fetch(`${current.apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: current.apiKey,
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
        ? data.error
        : `Evolution API retornou ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function getEvolutionState(config?: EvolutionConfig) {
  const current = config || (await getEvolutionConfig());
  if (!current.configured) {
    return {
      configured: false,
      instance: current.instance,
      state: "not_configured",
      source: current.source,
    };
  }

  try {
    const data = await evolutionFetch<any>(
      `/instance/connectionState/${encodeURIComponent(current.instance)}`,
      { method: "GET" },
      current
    );

    return {
      configured: true,
      instance: current.instance,
      state: data?.instance?.state || data?.state || data?.instance?.status || "unknown",
      source: current.source,
      raw: data,
    };
  } catch (error) {
    return {
      configured: true,
      instance: current.instance,
      state: "error",
      source: current.source,
      error: error instanceof Error ? error.message : "Erro ao consultar Evolution",
    };
  }
}

export async function sendEvolutionText(phone: string, text: string): Promise<EvolutionSendResult> {
  const config = await getEvolutionConfig();
  const formattedPhone = formatWhatsappNumber(phone);
  const fallback = whatsappUrl(formattedPhone, text);

  if (!formattedPhone || !text.trim()) {
    throw new Error("Telefone e mensagem sao obrigatorios");
  }

  if (!config.configured) {
    return {
      success: true,
      method: "redirect",
      configured: false,
      whatsappUrl: fallback,
      message: "Evolution API nao configurada; usando WhatsApp Web.",
    };
  }

  try {
    const raw = await evolutionFetch<any>(
      `/message/sendText/${encodeURIComponent(config.instance)}`,
      {
        method: "POST",
        body: JSON.stringify({
          number: formattedPhone,
          text,
          textMessage: { text },
          options: {
            delay: 900,
            presence: "composing",
            linkPreview: true,
          },
        }),
      },
      config
    );

    return {
      success: true,
      method: "api",
      configured: true,
      whatsappUrl: fallback,
      message: "Mensagem enviada pela Evolution API.",
      messageId: raw?.key?.id,
      raw,
    };
  } catch (error) {
    return {
      success: false,
      method: "redirect",
      configured: true,
      whatsappUrl: fallback,
      message: error instanceof Error ? error.message : "Erro na Evolution API; usando fallback.",
    };
  }
}
