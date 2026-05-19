#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🚀 Attempting to run migrations (prisma migrate deploy)..."
if npx prisma migrate deploy; then
  echo "✅ Migrations deployed."
else
  echo "⚠️  Migrate failed or no migrations found; applying schema with prisma db push..."
  npx prisma db push --accept-data-loss
fi

echo "🌱 Running seed (if configured)..."
if [ -f prisma/seed.ts ]; then
  npx prisma db seed || true
fi

echo "🎉 Database deploy finished."
