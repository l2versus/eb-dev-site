// ══════════════════════════════════════════════════════════════════════════════
// 📴 Página Offline — Exibida quando não há conexão
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Home, Mail } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00f0ff] rounded-full blur-[200px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.02, 0.05, 0.02] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ff00ff] rounded-full blur-[200px]"
      />

      <div className="relative z-10 text-center max-w-md">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 40px rgba(255,0,255,0.2)",
                  "0 0 60px rgba(0,240,255,0.3)",
                  "0 0 40px rgba(255,0,255,0.2)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-28 h-28 rounded-3xl border-2 border-[#ff00ff]/30 bg-[#ff00ff]/5 flex items-center justify-center mx-auto"
            >
              <WifiOff className="w-12 h-12 text-[#ff00ff]" />
            </motion.div>

            {/* Ping rings */}
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 border-2 border-[#ff00ff]/20 rounded-3xl"
            />
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="absolute inset-0 border-2 border-[#00f0ff]/20 rounded-3xl"
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Sem <span className="neon-text-magenta">Conexão</span>
          </h1>
          <p className="text-[#6b6b80] text-lg mb-2">
            Parece que você está offline no momento.
          </p>
          <p className="text-[#6b6b80] text-sm mb-8">
            Verifique sua conexão com a internet e tente novamente.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black bg-[#00f0ff] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </button>
        </motion.div>

        {/* Contact info (offline available) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 glass-card rounded-2xl p-6 border border-[#1e1e2e]"
        >
          <p className="text-sm text-[#6b6b80] mb-3">
            Precisa falar comigo? Use:
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://wa.me/5585998500344"
              className="flex items-center gap-2 text-[#00ff41] text-sm hover:underline"
            >
              📱 WhatsApp
            </a>
            <a
              href="mailto:emmanuelbezerra1992@gmail.com"
              className="flex items-center gap-2 text-[#00f0ff] text-sm hover:underline"
            >
              <Mail className="w-4 h-4" /> Email
            </a>
          </div>
        </motion.div>

        {/* Version */}
        <p className="text-[10px] text-[#3a3a4a] mt-8 font-mono">
          EB Dev PWA v1.0 • Cache disponível
        </p>
      </div>
    </div>
  );
}
