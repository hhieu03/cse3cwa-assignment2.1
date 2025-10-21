#!/bin/sh
set -e
echo "🔧 prisma generate (safety)…"
npx prisma generate
echo "🗃️  prisma migrate deploy…"
npx prisma migrate deploy
echo "🚀 next start (production)…"
exec npm run start
