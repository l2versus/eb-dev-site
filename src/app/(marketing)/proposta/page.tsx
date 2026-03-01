"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  Building,
  Globe,
  Shield,
  Clock,
  Sparkles,
  ArrowLeft,
  Printer
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------
   PROPOSTA COMERCIAL — PDF/PRINT READY
   ------------------------------------------------------------------*/

const packages = {
  starter: {
    name: "Starter",
    price: "R$ 2.500",
    description: "Landing Page Profissional",
    features: [
      "Landing page responsiva",
      "Até 5 seções customizadas",
      "Formulário de contato",
      "Integração WhatsApp",
      "SEO básico configurado",
      "1 revisão inclusa",
      "Prazo: 7-10 dias úteis"
    ]
  },
  pro: {
    name: "Pro",
    price: "R$ 5.500",
    description: "Site Institucional Completo",
    features: [
      "Site até 8 páginas",
      "Design 100% personalizado",
      "Blog integrado",
      "Painel administrativo",
      "SEO avançado",
      "Integração redes sociais",
      "3 revisões inclusas",
      "Prazo: 15-20 dias úteis"
    ]
  },
  enterprise: {
    name: "Enterprise",
    price: "R$ 15.000+",
    description: "Aplicação Web Completa",
    features: [
      "Sistema web completo",
      "Autenticação de usuários",
      "Dashboard personalizado",
      "APIs e integrações",
      "Banco de dados otimizado",
      "Infraestrutura escalável",
      "Suporte 90 dias",
      "Prazo: 30-45 dias úteis"
    ]
  }
};

const addons = [
  { name: "Chatbot IA", price: "R$ 1.500" },
  { name: "Dashboard Analytics", price: "R$ 2.500" },
  { name: "Sistema de Agendamento", price: "R$ 3.000" },
  { name: "Integração Pagamentos", price: "R$ 2.000" },
  { name: "E-mail Marketing", price: "R$ 1.000" },
  { name: "Otimização Performance", price: "R$ 1.500" }
];

export default function PropostaPage() {
  const proposalRef = useRef<HTMLDivElement>(null);
  const [clientData, setClientData] = useState({
    name: "",
    company: "",
    email: "",
    phone: ""
  });
  const [selectedPackage, setSelectedPackage] = useState<"starter" | "pro" | "enterprise">("pro");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const today = new Date();
  const validUntil = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const proposalNumber = `EB-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

  const calculateTotal = () => {
    const pkg = packages[selectedPackage];
    const basePrice = parseInt(pkg.price.replace(/[^\d]/g, ""));
    const addonsTotal = selectedAddons.reduce((sum, addonName) => {
      const addon = addons.find(a => a.name === addonName);
      return sum + (addon ? parseInt(addon.price.replace(/[^\d]/g, "")) : 0);
    }, 0);
    return basePrice + addonsTotal;
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleAddon = (addonName: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonName) 
        ? prev.filter(a => a !== addonName)
        : [...prev, addonName]
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Header - Hide on print */}
      <div className="print:hidden py-8 px-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            href="/orcamento"
            className="flex items-center gap-2 text-[#6b6b80] hover:text-[#00f0ff] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Orçamento
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 rounded-lg border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-colors"
            >
              {showPreview ? "Editar" : "Pré-visualizar"}
            </button>
            
            {showPreview && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] text-black font-bold hover:opacity-90 transition-opacity"
              >
                <Printer className="w-5 h-5" />
                Imprimir / Salvar PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {!showPreview ? (
        /* FORM - Configure Proposal */
        <div className="max-w-4xl mx-auto py-12 px-4 print:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] bg-clip-text text-transparent mb-4">
                Gerar Proposta Comercial
              </h1>
              <p className="text-[#6b6b80]">
                Preencha os dados abaixo para gerar uma proposta profissional em PDF
              </p>
            </div>

            {/* Client Data */}
            <div className="bg-[#12121a] rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#00f0ff]" />
                Dados do Cliente
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#6b6b80] mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({...clientData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/10 text-white focus:border-[#00f0ff] focus:outline-none transition-colors"
                    placeholder="João da Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b6b80] mb-2">Empresa (opcional)</label>
                  <input
                    type="text"
                    value={clientData.company}
                    onChange={(e) => setClientData({...clientData, company: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/10 text-white focus:border-[#00f0ff] focus:outline-none transition-colors"
                    placeholder="Empresa LTDA"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b6b80] mb-2">E-mail</label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/10 text-white focus:border-[#00f0ff] focus:outline-none transition-colors"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b6b80] mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/10 text-white focus:border-[#00f0ff] focus:outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* Package Selection */}
            <div className="bg-[#12121a] rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff00ff]" />
                Selecionar Pacote
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {(Object.entries(packages) as [keyof typeof packages, typeof packages.starter][]).map(([key, pkg]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPackage(key)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      selectedPackage === key 
                        ? "border-[#00f0ff] bg-[#00f0ff]/10" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-[#00f0ff] mb-2">{pkg.price}</p>
                    <p className="text-sm text-[#6b6b80]">{pkg.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div className="bg-[#12121a] rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#00ff41]" />
                Adicionar Extras (opcional)
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {addons.map((addon) => (
                  <button
                    key={addon.name}
                    onClick={() => toggleAddon(addon.name)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAddons.includes(addon.name) 
                        ? "border-[#ff00ff] bg-[#ff00ff]/10" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{addon.name}</span>
                      <span className="text-[#00f0ff] font-bold">{addon.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Preview */}
            <div className="bg-gradient-to-r from-[#00f0ff]/10 to-[#ff00ff]/10 rounded-2xl border border-[#00f0ff]/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6b6b80]">Total Estimado</p>
                  <p className="text-4xl font-bold text-white">
                    R$ {calculateTotal().toLocaleString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(true)}
                  disabled={!clientData.name || !clientData.email}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gerar Proposta
                </button>
              </div>
              {(!clientData.name || !clientData.email) && (
                <p className="text-sm text-[#ff6b6b] mt-2">
                  Preencha nome e e-mail do cliente para continuar
                </p>
              )}
            </div>
          </motion.div>
        </div>
      ) : (
        /* PROPOSAL PREVIEW - Print Ready */
        <div ref={proposalRef} className="proposal-document bg-white text-black print:bg-white">
          {/* Proposal Content */}
          <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
            
            {/* Header */}
            <div className="border-b-4 border-[#00f0ff] pb-8 mb-8 print:border-b-2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    PROPOSTA COMERCIAL
                  </h1>
                  <p className="text-gray-600">Desenvolvimento Web Profissional</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#00f0ff]">EB</div>
                  <p className="text-sm text-gray-600">Emmanuel Bezerra</p>
                  <p className="text-sm text-gray-600">Desenvolvedor Full-Stack</p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-8 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Proposta Nº:</span> {proposalNumber}
                </div>
                <div>
                  <span className="font-semibold">Data:</span> {today.toLocaleDateString("pt-BR")}
                </div>
                <div>
                  <span className="font-semibold">Válida até:</span> {validUntil.toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 print:bg-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#00f0ff]" />
                DADOS DO CLIENTE
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nome:</span>
                  <span className="ml-2 font-medium">{clientData.name}</span>
                </div>
                {clientData.company && (
                  <div>
                    <span className="text-gray-500">Empresa:</span>
                    <span className="ml-2 font-medium">{clientData.company}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">E-mail:</span>
                  <span className="ml-2 font-medium">{clientData.email}</span>
                </div>
                {clientData.phone && (
                  <div>
                    <span className="text-gray-500">Telefone:</span>
                    <span className="ml-2 font-medium">{clientData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Package */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00f0ff]" />
                ESCOPO DO PROJETO
              </h2>
              
              <div className="border-2 border-[#00f0ff] rounded-lg overflow-hidden">
                <div className="bg-[#00f0ff] text-black p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Pacote {packages[selectedPackage].name}</h3>
                      <p className="text-black/70">{packages[selectedPackage].description}</p>
                    </div>
                    <div className="text-2xl font-bold">
                      {packages[selectedPackage].price}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Incluso neste pacote:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {packages[selectedPackage].features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Addons */}
            {selectedAddons.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  SERVIÇOS ADICIONAIS
                </h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border">Serviço</th>
                      <th className="text-right p-3 border">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAddons.map((addonName) => {
                      const addon = addons.find(a => a.name === addonName);
                      return (
                        <tr key={addonName}>
                          <td className="p-3 border">{addonName}</td>
                          <td className="p-3 border text-right font-medium">{addon?.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Total */}
            <div className="bg-gray-900 text-white rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">INVESTIMENTO TOTAL</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Parcelamento em até 3x disponível
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-[#00f0ff]">
                    R$ {calculateTotal().toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00f0ff]" />
                GARANTIAS INCLUÍDAS
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🔒", title: "Código Proprietário", desc: "100% seu após entrega" },
                  { icon: "⏱️", title: "Prazo Garantido", desc: "Ou desconto proporcional" },
                  { icon: "🔄", title: "Revisões Inclusas", desc: "Ajustes sem custo extra" },
                  { icon: "🛡️", title: "Suporte Pós-Entrega", desc: "30 dias de garantia" }
                ].map((g, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{g.title}</p>
                      <p className="text-sm text-gray-600">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="border-t pt-6 text-sm text-gray-600">
              <h3 className="font-bold text-gray-900 mb-3">CONDIÇÕES DE PAGAMENTO</h3>
              <ul className="space-y-1">
                <li>• 50% de entrada para início do projeto</li>
                <li>• 50% restante na entrega final aprovada</li>
                <li>• Parcelamento em até 3x sem juros (consultar)</li>
                <li>• Proposta válida por 7 dias úteis</li>
              </ul>
            </div>

            {/* Signature Area */}
            <div className="mt-12 pt-8 border-t grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-b border-gray-300 mb-2 h-16"></div>
                <p className="text-sm text-gray-600">Emmanuel Bezerra</p>
                <p className="text-xs text-gray-400">Desenvolvedor / Prestador</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-300 mb-2 h-16"></div>
                <p className="text-sm text-gray-600">{clientData.name}</p>
                <p className="text-xs text-gray-400">Cliente / Contratante</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
              <p>Emmanuel Bezerra — Desenvolvimento Web Profissional</p>
              <p>contato@emmanuelbezerra.dev | (85) 99850-0344 | emmanuelbezerra.dev</p>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .proposal-document {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: white !important;
          }
          
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
    </main>
  );
}
