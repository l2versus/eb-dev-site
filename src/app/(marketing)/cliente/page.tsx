"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  Bell,
  Settings,
  ChevronRight,
  ExternalLink,
  Shield,
  Zap,
  Eye,
  Code2,
  Palette,
  Rocket,
  Lock,
  AlertCircle
} from "lucide-react";

/* ------------------------------------------------------------------
   ÁREA DO CLIENTE — Dashboard de Acompanhamento de Projetos
   ------------------------------------------------------------------*/

// Demo project data (in production would come from database)
const demoProject = {
  id: "PRJ-2024-001",
  name: "Landing Page — Myka Procópio",
  status: "in_progress",
  package: "Pro",
  startDate: "2024-01-15",
  expectedDelivery: "2024-02-05",
  progress: 65,
  investment: "R$ 5.500",
  paid: "R$ 2.750",
  remaining: "R$ 2.750",
  phases: [
    { id: 1, name: "Briefing & Discovery", status: "completed", date: "15/01", description: "Levantamento de requisitos e definição de escopo" },
    { id: 2, name: "Wireframes & UX", status: "completed", date: "18/01", description: "Estrutura visual e fluxo de navegação" },
    { id: 3, name: "Design Visual", status: "completed", date: "22/01", description: "Layout final com identidade visual" },
    { id: 4, name: "Desenvolvimento", status: "in_progress", date: "25/01", description: "Codificação e implementação de funcionalidades" },
    { id: 5, name: "Testes & QA", status: "pending", date: "01/02", description: "Validação de qualidade e correção de bugs" },
    { id: 6, name: "Entrega Final", status: "pending", date: "05/02", description: "Deploy e documentação de acesso" }
  ],
  files: [
    { name: "Briefing_Aprovado.pdf", type: "pdf", date: "15/01", size: "245 KB" },
    { name: "Wireframe_v1.fig", type: "design", date: "18/01", size: "1.2 MB" },
    { name: "Design_Final.fig", type: "design", date: "22/01", size: "3.5 MB" },
  ],
  messages: [
    { from: "Emmanuel", date: "25/01 14:30", message: "Design aprovado! Iniciando desenvolvimento." },
    { from: "Cliente", date: "24/01 10:15", message: "Adorei o design, pode prosseguir!" },
    { from: "Emmanuel", date: "22/01 16:00", message: "Design visual concluído. Por favor, revise e aprove." },
  ],
  nextSteps: [
    "Aguardar conclusão do desenvolvimento (previsão: 30/01)",
    "Revisar versão de homologação",
    "Aprovar para deploy em produção"
  ]
};

export default function ClienteDashboard() {
  const [activeTab, setActiveTab] = useState<"timeline" | "files" | "messages">("timeline");
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Demo authentication
  const handleAccess = () => {
    if (accessCode.toLowerCase() === "demo" || accessCode === "PRJ-2024-001") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Código inválido. Use 'demo' para visualizar.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#00ff41";
      case "in_progress": return "#00f0ff";
      case "pending": return "#6b6b80";
      default: return "#6b6b80";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in_progress": return Clock;
      case "pending": return Circle;
      default: return Circle;
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="py-8 px-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-[#6b6b80] hover:text-[#00f0ff] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Site
          </Link>
          
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00f0ff]" />
            <span className="text-sm text-[#6b6b80]">Área Segura do Cliente</span>
          </div>
        </div>
      </div>

      {!isAuthenticated ? (
        /* ACCESS FORM */
        <div className="max-w-md mx-auto py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#12121a] rounded-2xl border border-white/10 p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 mb-6">
                <Lock className="w-8 h-8 text-[#00f0ff]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Área do Cliente
              </h1>
              <p className="text-[#6b6b80]">
                Insira o código do projeto para acompanhar o andamento
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#6b6b80] mb-2">
                  Código do Projeto
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAccess()}
                  placeholder="Ex: PRJ-2024-001"
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/10 text-white focus:border-[#00f0ff] focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-red-400"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleAccess}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] text-black font-bold hover:opacity-90 transition-opacity"
              >
                Acessar Projeto
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-[#6b6b80]">
                Não recebeu seu código?{" "}
                <a href="https://wa.me/5585998500344" className="text-[#00f0ff] hover:underline">
                  Entre em contato
                </a>
              </p>
            </div>
          </motion.div>

          <p className="text-center text-sm text-[#6b6b80] mt-4">
            💡 Digite <code className="text-[#00f0ff]">demo</code> para ver uma demonstração
          </p>
        </div>
      ) : (
        /* DASHBOARD */
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#12121a] rounded-2xl border border-white/10 p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
                    {demoProject.id}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#ff00ff]/10 text-[#ff00ff] border border-[#ff00ff]/20">
                    Pacote {demoProject.package}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {demoProject.name}
                </h1>
                <p className="text-[#6b6b80]">
                  Previsão de entrega: {demoProject.expectedDelivery}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <p className="text-sm text-[#6b6b80]">Progresso do Projeto</p>
                  <p className="text-3xl font-bold text-[#00f0ff]">{demoProject.progress}%</p>
                </div>
                <div className="w-48 h-2 rounded-full bg-[#1a1a2e] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${demoProject.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#00f0ff] to-[#ff00ff]"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: Calendar, label: "Início", value: demoProject.startDate, color: "#00f0ff" },
              { icon: Rocket, label: "Entrega", value: demoProject.expectedDelivery, color: "#ff00ff" },
              { icon: Zap, label: "Pago", value: demoProject.paid, color: "#00ff41" },
              { icon: Clock, label: "Restante", value: demoProject.remaining, color: "#ffa500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#12121a] rounded-xl border border-white/10 p-4"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${stat.color}10` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-[#6b6b80]">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6"
          >
            {[
              { id: "timeline", label: "Timeline", icon: Clock },
              { id: "files", label: "Arquivos", icon: FileText },
              { id: "messages", label: "Mensagens", icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#00f0ff] text-black"
                    : "bg-[#12121a] text-[#6b6b80] hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#12121a] rounded-2xl border border-white/10 p-6"
          >
            {activeTab === "timeline" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Fases do Projeto</h2>
                
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00f0ff] via-[#ff00ff] to-[#6b6b80]" />
                  
                  {/* Phases */}
                  <div className="space-y-6">
                    {demoProject.phases.map((phase, index) => {
                      const StatusIcon = getStatusIcon(phase.status);
                      const statusColor = getStatusColor(phase.status);
                      
                      return (
                        <div key={phase.id} className="relative flex gap-6">
                          {/* Icon */}
                          <div 
                            className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2"
                            style={{ 
                              backgroundColor: `${statusColor}10`,
                              borderColor: statusColor
                            }}
                          >
                            <StatusIcon className="w-5 h-5" style={{ color: statusColor }} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 pb-6">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-white">{phase.name}</h3>
                              <span className="text-xs text-[#6b6b80]">{phase.date}</span>
                            </div>
                            <p className="text-sm text-[#6b6b80]">{phase.description}</p>
                            
                            {phase.status === "in_progress" && (
                              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                  className="w-2 h-2 rounded-full bg-[#00f0ff]"
                                />
                                <span className="text-xs text-[#00f0ff]">Em andamento</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#ff00ff]" />
                    Próximos Passos
                  </h3>
                  <ul className="space-y-2">
                    {demoProject.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#6b6b80]">
                        <ChevronRight className="w-4 h-4 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "files" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Arquivos do Projeto</h2>
                
                <div className="space-y-3">
                  {demoProject.files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0f] border border-white/5 hover:border-[#00f0ff]/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-[#00f0ff]/10">
                          <FileText className="w-5 h-5 text-[#00f0ff]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{file.name}</p>
                          <p className="text-xs text-[#6b6b80]">{file.date} • {file.size}</p>
                        </div>
                      </div>
                      
                      <button className="p-2 rounded-lg hover:bg-[#00f0ff]/10 text-[#6b6b80] hover:text-[#00f0ff] transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-[#6b6b80] text-center">
                    Precisa enviar algum arquivo?{" "}
                    <a href="#" className="text-[#00f0ff] hover:underline">Entre em contato</a>
                  </p>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Histórico de Mensagens</h2>
                
                <div className="space-y-4">
                  {demoProject.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg ${
                        msg.from === "Emmanuel"
                          ? "bg-[#00f0ff]/10 border border-[#00f0ff]/20 ml-8"
                          : "bg-[#ff00ff]/10 border border-[#ff00ff]/20 mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${msg.from === "Emmanuel" ? "text-[#00f0ff]" : "text-[#ff00ff]"}`}>
                          {msg.from}
                        </span>
                        <span className="text-xs text-[#6b6b80]">{msg.date}</span>
                      </div>
                      <p className="text-sm text-[#d1d1e0]">{msg.message}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-[#6b6b80] text-center">
                    Dúvidas?{" "}
                    <a 
                      href="https://wa.me/5585998500344" 
                      target="_blank"
                      className="text-[#00f0ff] hover:underline inline-flex items-center gap-1"
                    >
                      Fale pelo WhatsApp
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-[#00f0ff]/10 to-[#ff00ff]/10 rounded-2xl border border-[#00f0ff]/30 p-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                  <MessageSquare className="w-6 h-6 text-[#00f0ff]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Precisa de ajuda?</h3>
                  <p className="text-sm text-[#6b6b80]">
                    Estou disponível para tirar suas dúvidas sobre o projeto
                  </p>
                </div>
              </div>
              
              <a
                href="https://wa.me/5585998500344"
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00f0ff] text-black font-bold hover:opacity-90 transition-opacity"
              >
                <MessageSquare className="w-5 h-5" />
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
