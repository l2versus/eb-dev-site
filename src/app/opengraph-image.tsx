// ══════════════════════════════════════════════════════════════════════════════
// 🖼️ OG Image — Geração dinâmica de imagem para compartilhamento
// 1200×630 — padrão Open Graph
// ══════════════════════════════════════════════════════════════════════════════

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Emmanuel Bezerra — Desenvolvedor Full-Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #111118 40%, #0a0a0f 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow decorativo */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,240,255,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,0,255,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Borda superior neon */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #00f0ff, #ff00ff, #00ff41, #00f0ff)",
          }}
        />

        {/* Conteúdo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
            padding: "40px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(0,240,255,0.3)",
              background: "rgba(0,240,255,0.08)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00ff41",
              }}
            />
            <span style={{ color: "#00f0ff", fontSize: "16px", fontWeight: 600 }}>
              Disponível para novos projetos
            </span>
          </div>

          {/* Nome */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffffff",
              margin: "0 0 8px 0",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            Emmanuel Bezerra
          </h1>

          {/* Subtítulo */}
          <p
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: "0 0 20px 0",
              textAlign: "center",
              background: "linear-gradient(90deg, #00f0ff, #ff00ff)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Desenvolvedor Full-Stack
          </p>

          {/* Descrição */}
          <p
            style={{
              fontSize: "20px",
              color: "#8b8ba0",
              margin: "0 0 32px 0",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.5,
            }}
          >
            Sites, Apps & Sistemas Web de Alta Performance
            — Next.js • React • Node.js • TypeScript
          </p>

          {/* Tech badges */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["Next.js", "React", "Node.js", "TypeScript", "Python", "Tailwind"].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#e2e2ef",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            color: "#6b6b80",
            fontSize: "14px",
          }}
        >
          <span>📍 Fortaleza, CE</span>
          <span>📱 (85) 99850-0344</span>
          <span>🌐 emmanuelbezerra.dev</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
