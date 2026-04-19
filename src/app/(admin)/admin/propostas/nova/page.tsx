"use client";

// ══════════════════════════════════════════════════════════════════════════════
// 📄 Nova Proposta — Briefing + Geração por IA + Edição + Save
// ══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2, ArrowLeft, Save, Wand2, Plus, Trash2 } from "lucide-react";

type EscopoItem = { titulo: string; descricao: string };
type CronogramaItem = { semana: string; entrega: string; status: string };
type CustoOperacional = { servico: string; descricao: string; custoEstimado: string };
type Comparativo = { funcionalidade: string; antes: string; depois: string };
type Upgrade = { titulo: string; descricao: string };

type PropostaGerada = {
  titulo: string;
  subtitulo: string;
  chamadaPrincipal: string;
  descricao: string;
  valor: number;
  moeda: "BRL" | "USD";
  parcelamento: string;
  custoMensalRecorrente: number | null;
  prazoEstimado: string;
  validadeDias: number;
  tipoProjeto: string;
  itensInclusos: string[];
  escopoDetalhado: EscopoItem[];
  cronograma: CronogramaItem[];
  custosOperacionais: CustoOperacional[];
  comparativo: Comparativo[];
  upgradesFuturos: Upgrade[];
};

type Cliente = { id: string; nome: string; empresa: string | null };

export default function NovaPropostaPage() {
  const router = useRouter();
  const [briefing, setBriefing] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposta, setProposta] = useState<PropostaGerada | null>(null);
  const [usage, setUsage] = useState<{ input: number; cached: number; output: number } | null>(null);

  useEffect(() => {
    fetch("/api/clientes")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setClientes([]));
  }, []);

  async function gerar() {
    if (briefing.trim().length < 20) {
      setError("Briefing precisa de pelo menos 20 caracteres.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/propostas/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefing }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erro ao gerar");
      setProposta(data.proposta);
      setUsage(data.usage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!proposta || !clienteId) {
      setError("Selecione um cliente antes de salvar.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const validade = new Date();
      validade.setDate(validade.getDate() + proposta.validadeDias);

      const r = await fetch("/api/propostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId,
          titulo: proposta.titulo,
          subtitulo: proposta.subtitulo,
          chamadaPrincipal: proposta.chamadaPrincipal,
          descricao: proposta.descricao,
          valor: proposta.valor,
          valorFinal: proposta.valor,
          moeda: proposta.moeda,
          parcelamento: proposta.parcelamento,
          custoMensalRecorrente: proposta.custoMensalRecorrente,
          validade: validade.toISOString(),
          tipoProjeto: proposta.tipoProjeto,
          prazoEstimado: proposta.prazoEstimado,
          itensInclusos: proposta.itensInclusos,
          escopoDetalhado: proposta.escopoDetalhado,
          cronograma: proposta.cronograma,
          custosOperacionais: proposta.custosOperacionais,
          comparativo: proposta.comparativo,
          upgradesFuturos: proposta.upgradesFuturos,
          geradaPorIA: true,
          briefingIA: briefing,
        }),
      });
      if (!r.ok) {
        const data = await r.json();
        throw new Error(data.error || "Erro ao salvar");
      }
      router.push("/admin/propostas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  function updateItem<K extends keyof PropostaGerada>(key: K, value: PropostaGerada[K]) {
    if (!proposta) return;
    setProposta({ ...proposta, [key]: value });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/admin/propostas"
          className="inline-flex items-center gap-2 text-sm text-[#6b6b80] hover:text-[#00f0ff] mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Wand2 className="h-7 w-7 text-[#ff00ff]" />
          Nova Proposta com IA
        </h1>
        <p className="text-[#6b6b80] mb-8">
          Descreva o projeto em poucas frases. Claude gera uma proposta completa pra você editar e enviar.
        </p>

        {/* Briefing input */}
        <div className="bg-[#14141f] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
          <label className="block text-sm font-mono text-[#00f0ff] mb-2">
            BRIEFING DO PROJETO
          </label>
          <textarea
            value={briefing}
            onChange={(e) => setBriefing(e.target.value)}
            rows={5}
            placeholder="Ex: Clínica de estética em SP, dona Dra. Giovanna, precisa de site premium + CRM multi-pipeline + IA treinada no WhatsApp pra qualificar leads 24/7. Ticket médio alto, foco em pacientes de procedimentos avançados."
            className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4 text-white placeholder:text-[#3a3a4e] focus:border-[#00f0ff]/40 focus:outline-none resize-none text-sm"
            disabled={loading}
          />
          <button
            onClick={gerar}
            disabled={loading || briefing.trim().length < 20}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[#ff00ff] to-[#00f0ff] text-black disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Gerar com IA
              </>
            )}
          </button>
          {usage && (
            <p className="text-xs text-[#6b6b80] mt-3 font-mono">
              Tokens: {usage.input} in · {usage.cached} cache · {usage.output} out
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Proposta editável */}
        {proposta && (
          <div className="space-y-6">
            {/* Cliente + meta */}
            <div className="bg-[#14141f] border border-[#1e1e2e] rounded-2xl p-6 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#6b6b80] mb-1">CLIENTE</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                      {c.empresa ? ` — ${c.empresa}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#6b6b80] mb-1">TIPO</label>
                <input
                  value={proposta.tipoProjeto}
                  onChange={(e) => updateItem("tipoProjeto", e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Textos principais */}
            <Bloco titulo="TÍTULO & COPY">
              <Field label="Título" value={proposta.titulo} onChange={(v) => updateItem("titulo", v)} />
              <Field label="Subtítulo" value={proposta.subtitulo} onChange={(v) => updateItem("subtitulo", v)} />
              <Field
                label="Chamada principal"
                value={proposta.chamadaPrincipal}
                onChange={(v) => updateItem("chamadaPrincipal", v)}
                multiline
              />
              <Field
                label="Descrição"
                value={proposta.descricao}
                onChange={(v) => updateItem("descricao", v)}
                multiline
              />
            </Bloco>

            {/* Valores */}
            <Bloco titulo="INVESTIMENTO">
              <div className="grid md:grid-cols-2 gap-3">
                <Field
                  label="Valor"
                  value={String(proposta.valor)}
                  onChange={(v) => updateItem("valor", Number(v) || 0)}
                />
                <Field label="Moeda" value={proposta.moeda} onChange={(v) => updateItem("moeda", v as "BRL" | "USD")} />
                <Field
                  label="Parcelamento"
                  value={proposta.parcelamento}
                  onChange={(v) => updateItem("parcelamento", v)}
                />
                <Field
                  label="Custo mensal recorrente (opcional)"
                  value={proposta.custoMensalRecorrente?.toString() ?? ""}
                  onChange={(v) => updateItem("custoMensalRecorrente", v ? Number(v) : null)}
                />
                <Field label="Prazo" value={proposta.prazoEstimado} onChange={(v) => updateItem("prazoEstimado", v)} />
                <Field
                  label="Validade (dias)"
                  value={String(proposta.validadeDias)}
                  onChange={(v) => updateItem("validadeDias", Number(v) || 15)}
                />
              </div>
            </Bloco>

            {/* Itens inclusos */}
            <Bloco titulo="ITENS INCLUSOS">
              <ListaEditavel
                items={proposta.itensInclusos}
                onChange={(items) => updateItem("itensInclusos", items)}
                placeholder="Ex: Site premium com SEO"
              />
            </Bloco>

            {/* Escopo detalhado */}
            <Bloco titulo="ESCOPO DETALHADO">
              <ObjetosEditaveis
                items={proposta.escopoDetalhado}
                keys={["titulo", "descricao"]}
                labels={["Título", "Descrição"]}
                onChange={(items) => updateItem("escopoDetalhado", items as EscopoItem[])}
                novo={{ titulo: "", descricao: "" }}
              />
            </Bloco>

            {/* Cronograma */}
            <Bloco titulo="CRONOGRAMA">
              <ObjetosEditaveis
                items={proposta.cronograma}
                keys={["semana", "entrega", "status"]}
                labels={["Semana", "Entrega", "Status"]}
                onChange={(items) => updateItem("cronograma", items as CronogramaItem[])}
                novo={{ semana: "", entrega: "", status: "pendente" }}
              />
            </Bloco>

            {/* Custos operacionais */}
            <Bloco titulo="CUSTOS OPERACIONAIS">
              <ObjetosEditaveis
                items={proposta.custosOperacionais}
                keys={["servico", "descricao", "custoEstimado"]}
                labels={["Serviço", "Descrição", "Custo"]}
                onChange={(items) => updateItem("custosOperacionais", items as CustoOperacional[])}
                novo={{ servico: "", descricao: "", custoEstimado: "" }}
              />
            </Bloco>

            {/* Comparativo */}
            <Bloco titulo="COMPARATIVO">
              <ObjetosEditaveis
                items={proposta.comparativo}
                keys={["funcionalidade", "antes", "depois"]}
                labels={["Funcionalidade", "Antes", "Depois"]}
                onChange={(items) => updateItem("comparativo", items as Comparativo[])}
                novo={{ funcionalidade: "", antes: "", depois: "" }}
              />
            </Bloco>

            {/* Upgrades futuros */}
            <Bloco titulo="UPGRADES FUTUROS">
              <ObjetosEditaveis
                items={proposta.upgradesFuturos}
                keys={["titulo", "descricao"]}
                labels={["Título", "Descrição"]}
                onChange={(items) => updateItem("upgradesFuturos", items as Upgrade[])}
                novo={{ titulo: "", descricao: "" }}
              />
            </Bloco>

            {/* Save */}
            <div className="sticky bottom-4 bg-[#0a0a0f] border border-[#00f0ff]/30 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm text-[#6b6b80]">Revise os campos e salve no banco.</span>
              <button
                onClick={salvar}
                disabled={saving || !clienteId}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#00ff41] text-black disabled:opacity-40 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar proposta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componentes auxiliares ────────────────────────────────────────────────────

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#14141f] border border-[#1e1e2e] rounded-2xl p-6">
      <h3 className="text-xs font-mono text-[#00f0ff] mb-4 tracking-widest">{titulo}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-[#6b6b80] mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00f0ff]/40 focus:outline-none resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00f0ff]/40 focus:outline-none"
        />
      )}
    </div>
  );
}

function ListaEditavel({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="flex-1 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="px-3 rounded-lg border border-[#1e1e2e] text-[#6b6b80] hover:text-red-400 hover:border-red-400/40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-2 text-xs text-[#00f0ff] hover:text-[#00f0ff]/70"
      >
        <Plus className="h-3 w-3" /> Adicionar item
      </button>
    </div>
  );
}

function ObjetosEditaveis<T extends Record<string, string>>({
  items,
  keys,
  labels,
  onChange,
  novo,
}: {
  items: T[];
  keys: string[];
  labels: string[];
  onChange: (v: T[]) => void;
  novo: T;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 space-y-2 relative">
          {keys.map((k, idx) => (
            <Field
              key={k}
              label={labels[idx]}
              value={(item[k] as string) ?? ""}
              onChange={(v) => {
                const next = [...items];
                next[i] = { ...next[i], [k]: v };
                onChange(next);
              }}
              multiline={k === "descricao" || k === "chamadaPrincipal"}
            />
          ))}
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="absolute top-2 right-2 p-1.5 rounded border border-[#1e1e2e] text-[#6b6b80] hover:text-red-400 hover:border-red-400/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { ...novo }])}
        className="inline-flex items-center gap-2 text-xs text-[#00f0ff] hover:text-[#00f0ff]/70"
      >
        <Plus className="h-3 w-3" /> Adicionar
      </button>
    </div>
  );
}
