#!/bin/bash
# Build script that handles missing DATABASE_URL for Prisma generate
# This is needed for Netlify builds where DATABASE_URL might not be set

# Set a dummy DATABASE_URL if not provided (only needed for prisma generate)
if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://user:password@localhost:5432/db"
fi

# Run the build commands
pnpm prisma generate
pnpm vite build
pnpm esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

