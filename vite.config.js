import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // GitHub Pages serves the app from /<repo-name>/; the dev server uses /
  base: command === 'build' || isPreview ? '/neighborhood-exchange/' : '/',
}))
