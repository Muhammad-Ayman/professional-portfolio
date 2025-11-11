#!/usr/bin/env node
// Cross-platform build script that handles missing DATABASE_URL for Prisma generate
// This is needed for Netlify builds where DATABASE_URL might not be set

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we're in the project root directory
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Debug: List client directory contents
console.log('=== Debugging client directory ===');
console.log('Project root:', projectRoot);
const clientDir = path.join(projectRoot, 'client');
console.log('Client directory:', clientDir);
console.log('Client directory exists:', fs.existsSync(clientDir));

if (fs.existsSync(clientDir)) {
  console.log('Client directory contents:');
  const files = fs.readdirSync(clientDir);
  files.forEach(file => {
    const fullPath = path.join(clientDir, file);
    const stats = fs.statSync(fullPath);
    console.log(`  ${file} - ${stats.isDirectory() ? 'DIR' : 'FILE'} - ${stats.size} bytes`);
  });
}

// Verify index.html exists
const indexHtmlPath = path.join(projectRoot, 'client', 'index.html');
console.log('Looking for index.html at:', indexHtmlPath);
console.log('index.html exists:', fs.existsSync(indexHtmlPath));

if (!fs.existsSync(indexHtmlPath)) {
  console.error(`Error: index.html not found at ${indexHtmlPath}`);
  process.exit(1);
}

// Check if it's a file (not a directory)
const stats = fs.statSync(indexHtmlPath);
console.log('index.html stats:', {
  isFile: stats.isFile(),
  isDirectory: stats.isDirectory(),
  isSymbolicLink: stats.isSymbolicLink(),
  size: stats.size
});

if (!stats.isFile()) {
  console.error(`Error: ${indexHtmlPath} exists but is not a file (it's a directory)`);
  
  // If it's a directory, list its contents
  if (stats.isDirectory()) {
    console.log('Contents of index.html directory:');
    const contents = fs.readdirSync(indexHtmlPath);
    contents.forEach(item => {
      console.log(`  - ${item}`);
    });
  }
  
  process.exit(1);
}

console.log('✓ index.html verified as a file');
console.log('=== End debugging ===\n');

// Clean dist folder to avoid conflicts
const distDir = path.join(projectRoot, 'dist');
console.log('Cleaning dist directory...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✓ dist directory cleaned');
}

// Set a dummy DATABASE_URL if not provided (only needed for prisma generate)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/db';
}

try {
  console.log('\nGenerating Prisma client...');
  execSync('pnpm prisma generate', { stdio: 'inherit', cwd: projectRoot });
  
  console.log('\nBuilding client...');
  execSync('pnpm vite build', { stdio: 'inherit', cwd: projectRoot });
  
  console.log('\nBuilding server...');
  execSync('pnpm esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit', cwd: projectRoot });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

