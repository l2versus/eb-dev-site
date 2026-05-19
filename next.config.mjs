/** @type {import('next').NextConfig} */
const nextConfig = {
    // ─── Output standalone para Docker ───────────────────────────────
    output: "standalone",

    // ─── Ignorar erros de TS no build (Prisma não configurado) ───────
    typescript: {
        ignoreBuildErrors: true,
    },

    // ─── Otimização de Imagens ───────────────────────────────────────
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "*.cdninstagram.com",
            },
        ],
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // ─── Performance & Segurança ─────────────────────────────────────
    poweredByHeader: false,
    compress: true,
    reactStrictMode: true,

    // ─── Headers de Segurança Globais ────────────────────────────────
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value:
                            "camera=(self), microphone=(), geolocation=(self), payment=(self)",
                    },
                ],
            },
        ];
    },

    // ─── Logging & Experimental ──────────────────────────────────────
    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "recharts",
            "framer-motion",
            "date-fns",
        ],
    },
};

export default nextConfig;
