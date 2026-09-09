import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works both locally and under a GitHub Pages sub-path.
export default defineConfig({
  plugins: [react()],
  server: { host: true },
  preview: { host: true },
  // Set VITE_BASE_PATH to `/<repository-name>/` for a project Pages site.
  base: process.env.VITE_BASE_PATH || './',
});
