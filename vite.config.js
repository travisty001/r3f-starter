import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves project sites beneath /<repository>/.
  // Leave the local development server at http://localhost:5173/.
  base: command === 'build' ? '/r3f-starter/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
}));
