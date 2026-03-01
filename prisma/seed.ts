// ══════════════════════════════════════════════════════════════════════════════
// 🌱 SEED — Criar usuário Admin inicial
// Execute com: npx prisma db seed
// ══════════════════════════════════════════════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ─── Criar Admin ────────────────────────────────────────────────────────────
  const adminEmail = "admin@emmanuelbezerra.dev";
  const adminPassword = "Admin@2024#EB"; // ALTERE APÓS O PRIMEIRO LOGIN!

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = await prisma.user.create({
      data: {
        name: "Emmanuel Bezerra",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "ADMIN",
        active: true,
      },
    });

    console.log("✅ Admin criado:", admin.email);
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Senha:", adminPassword);
    console.log("⚠️  ALTERE A SENHA APÓS O PRIMEIRO LOGIN!");
  } else {
    console.log("ℹ️  Admin já existe:", existingAdmin.email);
  }

  console.log("🌱 Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
