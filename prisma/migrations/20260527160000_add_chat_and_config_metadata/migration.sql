-- Add admin configuration metadata used by /api/configuracoes.
ALTER TABLE "configuracoes_sistema"
  ADD COLUMN IF NOT EXISTS "metadata" JSONB;

-- Chat conversations backing the admin/client inbox and WhatsApp webhook.
CREATE TABLE IF NOT EXISTS "chat_conversas" (
  "id" TEXT NOT NULL,
  "clienteId" TEXT,
  "clienteNome" TEXT NOT NULL,
  "clienteEmail" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ativo',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "chat_conversas_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "chat_conversas_clienteId_idx"
  ON "chat_conversas"("clienteId");

CREATE INDEX IF NOT EXISTS "chat_conversas_updatedAt_idx"
  ON "chat_conversas"("updatedAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chat_conversas_clienteId_fkey'
  ) THEN
    ALTER TABLE "chat_conversas"
      ADD CONSTRAINT "chat_conversas_clienteId_fkey"
      FOREIGN KEY ("clienteId") REFERENCES "clientes"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Chat messages backing the admin/client inbox and WhatsApp webhook.
CREATE TABLE IF NOT EXISTS "chat_mensagens" (
  "id" TEXT NOT NULL,
  "conversaId" TEXT NOT NULL,
  "remetente" TEXT NOT NULL,
  "remetenteNome" TEXT NOT NULL,
  "conteudo" TEXT NOT NULL,
  "tipo" TEXT NOT NULL DEFAULT 'texto',
  "lida" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "chat_mensagens_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "chat_mensagens_conversaId_idx"
  ON "chat_mensagens"("conversaId");

CREATE INDEX IF NOT EXISTS "chat_mensagens_createdAt_idx"
  ON "chat_mensagens"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chat_mensagens_conversaId_fkey'
  ) THEN
    ALTER TABLE "chat_mensagens"
      ADD CONSTRAINT "chat_mensagens_conversaId_fkey"
      FOREIGN KEY ("conversaId") REFERENCES "chat_conversas"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
