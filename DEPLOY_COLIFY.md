# Deploy do Banco (Colify)

Passos rápidos para subir o banco Postgres no Colify e aplicar o schema/seed do projeto.

1) Provisionar um banco Postgres no Colify
   - Crie uma nova instância PostgreSQL no painel Colify.
   - Copie a connection string (ex: `postgresql://user:pass@host:5432/dbname`).

2) Variáveis de ambiente no Colify (mínimas)
   - `DATABASE_URL` = string de conexão PostgreSQL
   - `AUTH_SECRET` = segredo para NextAuth
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (se for usar OAuth)
   - `ENCRYPTION_KEY`, `ENCRYPTION_IV` (se usar criptografia LGPD)
   - `NODE_ENV=production`

3) Como aplicar o schema e seed (via shell no Colify)
   - Abra um terminal no ambiente onde seu app roda (ou use o painel CLI do Colify). Depois execute:

```bash
# instalar dependências
npm ci

# gerar Prisma Client e aplicar migrations (tenta migrate, cai para db push)
npm run db:deploy

# opcional: inspecionar dados com Prisma Studio (apenas dev)
npx prisma studio --url "$DATABASE_URL" --port 5555
```

O comando `npm run db:deploy` executa `prisma generate`, tenta `prisma migrate deploy` (se houver migrations committed), e em falta de migrations faz `prisma db push` como fallback. Depois tenta rodar `prisma db seed` se o projeto possuir `prisma/seed.ts`.

4) Notas e recomendações
   - Ideal: gerar migrations localmente com `prisma migrate dev --name init` e commitar a pasta `prisma/migrations` antes do deploy, para usar `prisma migrate deploy` em produção. Se preferir este fluxo eu posso gerar as migrations aqui.
   - Garanta que o valor de `DATABASE_URL` contém `?schema=public` se desejar um schema específico.
   - Mantenha o `AUTH_SECRET` e chaves de criptografia seguras (variáveis de ambiente no Colify).

5) Depois do DB pronto
   - Configure o frontend no Vercel apontando `NEXT_PUBLIC_APP_URL` e demais variáveis.
   - Teste o login e o painel `/admin`.

Se quiser, eu gero as migrations SQL iniciais e commito no repositório para que `prisma migrate deploy` funcione automaticamente — quer que eu faça isso agora?
