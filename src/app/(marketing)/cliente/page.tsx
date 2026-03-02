// ══════════════════════════════════════════════════════════════════════════════
// 👤 Área do Cliente — Dashboard de Acompanhamento (Mobile-First)
// Integrado com shared-project.ts para dados reais do admin
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  MessageSquare,
  FileText,
  Calendar,
  Download,
  Upload,
  ChevronRight,
  Shield,
  Zap,
  Rocket,
  Lock,
  AlertCircle,
  Send,
} from "lucide-react";
import {
  getProjectByCode,
  addMessage,
  addFile,
  genId,
  type ProjetoCliente,
} from "@/lib/shared-project";

export default function ClienteDashboard() {
  const [activeTab, setActiveTab] = useState<"timeline" | "files" | "messages">("timeline");
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [project, setProject] = useState<ProjetoCliente | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const msgEndRef = useRef<HTMLDivElement>(null);

  // Reload project data periodically (for admin updates)
  useEffect(() => {
    if (!project) return;
    const interval = setInterval(() => {
      const fresh = getProjectByCode(project.accessCode);
      if (fresh) setProject({ ...fresh });
    }, 5000);
    return () => clearInterval(interval);
  }, [project]);

  const handleAccess = () => {
    const found = getProjectByCode(accessCode);
    if (found) {
      setProject(found);
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Código inválido. Verifique e tente novamente.");
    }
  };

  const handleSendMessage = () => {
    if (!project || !newMessage.trim()) return;
    const msg = {
      id: genId(),
      from: "Cliente" as const,
      date: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: newMessage.trim(),
    };
    addMessage(project.id, msg);
    setProject((p) => (p ? { ...p, messages: [msg, ...p.messages] } : p));
    setNewMessage("");
    setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const novoArquivo = {
        id: genId(),
        name: file.name,
        type: file.name.split(".").pop() || "file",
        size:
          file.size > 1048576
            ? `${(file.size / 1048576).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(0)} KB`,
        date: new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        uploadedBy: "cliente" as const,
        url: reader.result as string,
      };
      addFile(project.id, novoArquivo);
      setProject((p) => (p ? { ...p, files: [...p.files, novoArquivo] } : p));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#00ff41";
      case "in_progress": return "#00f0ff";
      default: return "#6b6b80";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in_progress": return Clock;
      default: return Circle;
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex flex-col">
        {/* Header */}
        <div className="py-4 px-4 border-b border-white/10">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#6b6b80] hover:text-[#00f0ff] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar ao Site</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-xs text-[#6b6b80]">Área Segura</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            <div className="bg-[#12121a] rounded-2xl border border-white/10 p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 mb-4">
                  <Lock className="w-7 h-7 text-[#00f0ff]" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Área do Cliente
                </h1>
                <p className="text-sm text-[#6b6b80]">
                  Insira o código para acompanhar seu projeto
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#6b6b80] mb-1.5">
                    Código do Projeto
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAccess()}
                    placeholder="Ex: demo"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 text-white text-sm focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/30 transition-all"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-xs text-red-400 overflow-hidden"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleAccess}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] text-black text-sm font-bold hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                  Acessar Projeto
                </button>
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 text-center">
                <p className="text-xs text-[#6b6b80]">
                  Não recebeu seu código?{" "}
                  <a
                    href="https://wa.me/5585998500344"
                    target="_blank"
                    className="text-[#00f0ff] hover:underline"
                  >
                    Fale conosco
                  </a>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-[#6b6b80] mt-4">
              💡 Digite <code className="text-[#00f0ff]">demo</code> para demonstração
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────
  if (!project) return null;

  const tabs = [
    { id: "timeline" as const, label: "Fases", icon: Clock },
    { id: "files" as const, label: "Arquivos", icon: FileText },
    { id: "messages" as const, label: "Mensagens", icon: MessageSquare },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#6b6b80] hover:text-[#00f0ff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Voltar</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
              {project.id}
            </span>
            <Shield className="w-3.5 h-3.5 text-[#00f0ff]" />
          </div>
        </div>
      </header>

      {/* ── PROJECT INFO (compact on mobile) ───────────────────────── */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-5 pb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#12121a] rounded-2xl border border-white/10 p-4 sm:p-6"
        >
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#ff00ff]/10 text-[#ff00ff]">
                  {project.package}
                </span>
                <span className="text-[10px] text-[#6b6b80]">
                  Entrega: {project.expectedDelivery || "A definir"}
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-white truncate">
                {project.name}
              </h1>
            </div>

            {/* Progress circle */}
            <div className="flex-shrink-0 text-center">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831"
                    fill="none"
                    stroke="#1e1e2e"
                    strokeWidth="3"
                  />
                  <motion.path
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831"
                    fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${project.progress}, 100` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#ff00ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-[#00f0ff]">
                  {project.progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats row — 2x2 on mobile, 4 cols on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: Calendar, label: "Início", value: project.startDate || "-", color: "#00f0ff" },
              { icon: Rocket, label: "Entrega", value: project.expectedDelivery || "-", color: "#ff00ff" },
              { icon: Zap, label: "Pago", value: project.paid, color: "#00ff41" },
              { icon: Clock, label: "Restante", value: project.remaining, color: "#ffa500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0a0a0f]/80 border border-white/5"
              >
                <stat.icon className="w-4 h-4 flex-shrink-0" style={{ color: stat.color }} />
                <div className="min-w-0">
                  <p className="text-[10px] text-[#6b6b80] leading-none">{stat.label}</p>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── TABS (sticky on mobile) ────────────────────────────────── */}
      <div className="sticky top-14 z-20 bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-[#00f0ff] text-[#00f0ff]"
                    : "border-transparent text-[#6b6b80] hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "messages" && project.messages.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-[#ff00ff]/20 text-[#ff00ff]">
                    {project.messages.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ────────────────────────────────────────────── */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-5">
        <AnimatePresence mode="wait">
          {/* ── TIMELINE ─────────────────────────────────────────── */}
          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-0"
            >
              {project.phases.map((phase, index) => {
                const StatusIcon = getStatusIcon(phase.status);
                const color = getStatusColor(phase.status);
                const isLast = index === project.phases.length - 1;

                return (
                  <div key={phase.id} className="flex gap-3 sm:gap-4">
                    {/* Timeline rail */}
                    <div className="flex flex-col items-center">
                      <div
                        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex-shrink-0"
                        style={{
                          backgroundColor: `${color}10`,
                          borderColor: color,
                        }}
                      >
                        <StatusIcon className="w-4 h-4" style={{ color }} />
                      </div>
                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 min-h-[2rem]"
                          style={{
                            background: `linear-gradient(to bottom, ${color}, ${getStatusColor(project.phases[index + 1]?.status || "pending")})`,
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="text-sm font-semibold"
                          style={{
                            color: phase.status === "pending" ? "#6b6b80" : "#fff",
                          }}
                        >
                          {phase.name}
                        </h3>
                        <span className="text-[10px] text-[#6b6b80]">{phase.date}</span>
                      </div>
                      <p className="text-xs text-[#6b6b80] mt-0.5 leading-relaxed">
                        {phase.description}
                      </p>
                      {phase.status === "in_progress" && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"
                          />
                          <span className="text-[10px] text-[#00f0ff] font-medium">
                            Em andamento
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Next Steps */}
              {project.nextSteps.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-semibold text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-[#ff00ff]" />
                    Próximos Passos
                  </h3>
                  <ul className="space-y-2">
                    {project.nextSteps.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-[#6b6b80]"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* ── FILES ────────────────────────────────────────────── */}
          {activeTab === "files" && (
            <motion.div
              key="files"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {/* Upload area */}
              <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#6b6b80]/30 hover:border-[#00f0ff]/50 bg-[#12121a]/50 cursor-pointer transition-colors active:scale-[0.99]">
                <Upload className="w-5 h-5 text-[#00f0ff]" />
                <span className="text-sm text-[#6b6b80]">
                  Enviar arquivo ou referência
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {project.files.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 text-[#6b6b80]/30 mx-auto mb-2" />
                  <p className="text-xs text-[#6b6b80]">Nenhum arquivo ainda</p>
                </div>
              )}

              {project.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#12121a] border border-white/5 hover:border-[#00f0ff]/20 transition-colors"
                >
                  <div
                    className="flex-shrink-0 p-2 rounded-lg"
                    style={{
                      backgroundColor:
                        file.uploadedBy === "admin"
                          ? "rgba(0,240,255,0.1)"
                          : "rgba(255,0,255,0.1)",
                    }}
                  >
                    <FileText
                      className="w-4 h-4"
                      style={{
                        color: file.uploadedBy === "admin" ? "#00f0ff" : "#ff00ff",
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-[#6b6b80]">
                      {file.size} · {file.date} ·{" "}
                      {file.uploadedBy === "admin" ? "Emmanuel" : "Você"}
                    </p>
                  </div>
                  {file.url && (
                    <a
                      href={file.url}
                      download={file.name}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-white/5 text-[#6b6b80] hover:text-[#00f0ff] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* ── MESSAGES ──────────────────────────────────────────── */}
          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col"
            >
              {/* Message input (top on mobile for thumb reach) */}
              <div className="flex gap-2 mb-4">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Escreva uma mensagem..."
                  className="flex-1 px-3 py-2.5 rounded-xl bg-[#12121a] border border-white/10 text-sm text-white placeholder-[#6b6b80] focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/30 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="flex-shrink-0 p-2.5 rounded-xl bg-[#00f0ff] text-black disabled:opacity-30 transition-opacity active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="space-y-2.5">
                {project.messages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-[#6b6b80]/30 mx-auto mb-2" />
                    <p className="text-xs text-[#6b6b80]">Nenhuma mensagem ainda</p>
                    <p className="text-[10px] text-[#6b6b80] mt-1">
                      Envie a primeira mensagem!
                    </p>
                  </div>
                )}
                {project.messages.map((msg) => {
                  const isEmmanuel = msg.from === "Emmanuel";
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] sm:max-w-[75%] ${
                        isEmmanuel ? "mr-auto" : "ml-auto"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-sm ${
                          isEmmanuel
                            ? "bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-tl-sm"
                            : "bg-[#ff00ff]/10 border border-[#ff00ff]/20 rounded-tr-sm"
                        }`}
                      >
                        <p className="text-[#d1d1e0] text-xs sm:text-sm leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 mt-1 ${
                          isEmmanuel ? "" : "justify-end"
                        }`}
                      >
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: isEmmanuel ? "#00f0ff" : "#ff00ff" }}
                        >
                          {msg.from}
                        </span>
                        <span className="text-[10px] text-[#6b6b80]">{msg.date}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={msgEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HELP FOOTER ─────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto w-full px-4 pb-6">
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#00f0ff]/5 to-[#ff00ff]/5 border border-[#00f0ff]/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 p-2 rounded-xl bg-[#00f0ff]/10">
              <MessageSquare className="w-4 h-4 text-[#00f0ff]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-white">
                Precisa de ajuda?
              </p>
              <p className="text-[10px] sm:text-xs text-[#6b6b80] truncate">
                Tire suas dúvidas sobre o projeto
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/5585998500344"
            target="_blank"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#00f0ff] text-black text-xs font-bold hover:opacity-90 transition-opacity active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">Falar</span>
          </a>
        </div>
      </div>
    </main>
  );
}
