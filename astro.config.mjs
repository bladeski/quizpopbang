// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import node from '@astrojs/node';
import sidecar from 'astro-sidecar';

const { PUBLIC_PORT } = loadEnv(process.env.NODE_ENV || '', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',

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
    port: parseInt(PUBLIC_PORT)
  }
});