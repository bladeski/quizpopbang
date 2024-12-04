// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import node from '@astrojs/node';
import sidecar from 'astro-sidecar';

const { PUBLIC_PORT, PUBLIC_BASE_URL } = loadEnv(process.env.NODE_ENV || '', process.cwd(), '');
console.log(`Public port: ${PUBLIC_PORT}`);

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  site: PUBLIC_BASE_URL,
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    sidecar({
      entryPoints: [
        './src/websockets/ws-server.ts'
      ]
    })
  ],
  server: {
    port: parseInt(PUBLIC_PORT),
    host: true
  }
});