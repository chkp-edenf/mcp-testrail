#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = resolve(__dirname, '../dist/server/server.js');

// Environment variables for the MCP Inspector
process.env.CLIENT_PORT = process.env.CLIENT_PORT || '6274';
process.env.SERVER_PORT = process.env.SERVER_PORT || '6277';

// Launch the MCP Inspector with our server
const inspector = spawn('npx', [
  '@modelcontextprotocol/inspector',
  'node',
  serverPath,
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
  },
});

// Handle process termination
process.on('SIGINT', () => {
  inspector.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  inspector.kill('SIGTERM');
  process.exit(0);
});

inspector.on('exit', (code) => {
  process.exit(code);
}); 