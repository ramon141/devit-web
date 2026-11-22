/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    // Mesma origem da API: sem isso o jsdom aplica CORS nas requisições do axios
    environmentOptions: { jsdom: { url: 'http://localhost:3006' } },
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    env: {
      VITE_APP_BASE_API_URL: 'http://localhost:3006',
    },
    // Com a suíte inteira rodando a máquina fica carregada e o prazo padrão (5s) estoura
    testTimeout: 20000,
    hookTimeout: 20000,
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/api/generated/**', 'src/test/**', 'src/**/*.test.{ts,tsx}'],
    },
  },
})
