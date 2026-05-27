#!/bin/sh
set -e

echo "Running database setup..."
cd /app
npx prisma db push --skip-generate
npx tsx prisma/seed.ts

echo "Starting Next.js..."
exec node server.js
