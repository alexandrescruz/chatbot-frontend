import { defineConfig } from 'vite';
export default defineConfig({
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: { lib: { entry: 'src/embed.jsx', name: 'SiteChatbot', formats: ['iife'], fileName: () => 'chatbot.js' } },
});
