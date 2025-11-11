#!/usr/bin/env node
// Cross-platform build script that handles missing DATABASE_URL for Prisma generate
// This is needed for Netlify builds where DATABASE_URL might not be set

const { execSync } = require('child_process');

// Set a dummy DATABASE_URL if not provided (only needed for prisma generate)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/db';
}

try {
  console.log('Generating Prisma client...');
  execSync('pnpm prisma generate', { stdio: 'inherit' });
  
  console.log('Building client...');
  execSync('pnpm vite build', { stdio: 'inherit' });
  
  console.log('Building server...');
  execSync('pnpm esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

