// ══════════════════════════════════════════════════════════════════════════════
// 🔐 Configuração de Autenticação — NextAuth.js v5
// OAuth 2.0 com Google e credenciais + JWT + Cookies HTTP-only
// ══════════════════════════════════════════════════════════════════════════════

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

type Role = "ADMIN" | "SUPER_ADMIN" | "USER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma) as any,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 horas
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },

  providers: [
    // ─── Google OAuth 2.0 ─────────────────────────────────────────────
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // ─── Login com Email + Senha (bcrypt 10 rounds) ──────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Admin hardcoded (sem necessidade de DB)
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@emmanuelbezerra.dev";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@Luna1992_";

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          return {
            id: "admin-1",
            name: "Emmanuel Bezerra",
            email: ADMIN_EMAIL,
            image: null,
            role: "ADMIN" as Role,
          };
        }

        // Tentar Prisma como fallback (se DB estiver rodando)
        try {
          const { prisma } = await import("@/lib/prisma");
          const bcrypt = (await import("bcryptjs")).default;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            throw new Error("Credenciais inválidas");
          }

          if (!user.active) {
            throw new Error("Conta desativada.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
          if (!isPasswordValid) {
            throw new Error("Credenciais inválidas");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role as Role,
          };
        } catch {
          throw new Error("Credenciais inválidas");
        }
      },
    }),
  ],

  callbacks: {
    // ─── Controle de acesso por rota ──────────────────────────────────
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnApp = nextUrl.pathname.startsWith("/dashboard");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;
        const role = auth.user.role;
        return role === "ADMIN" || role === "SUPER_ADMIN";
      }

      if (isOnApp) {
        return isLoggedIn;
      }

      return true;
    },

    // ─── Injetar dados no JWT ─────────────────────────────────────────
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },

    // ─── Injetar dados na sessão ──────────────────────────────────────
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },

  // ─── Eventos de auditoria ───────────────────────────────────────────
  events: {
    async signIn({ user }) {
      try {
        const { prisma } = await import("@/lib/prisma");
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            entity: "User",
            entityId: user.id,
          },
        });
      } catch {
        // DB offline — ignora silenciosamente
      }
    },
    async signOut(message) {
      try {
        if ("token" in message && message.token?.sub) {
          const { prisma } = await import("@/lib/prisma");
          await prisma.auditLog.create({
            data: {
              userId: message.token.sub,
              action: "LOGOUT",
              entity: "User",
              entityId: message.token.sub,
            },
          });
        }
      } catch {
        // DB offline — ignora silenciosamente
      }
    },
  },
});
