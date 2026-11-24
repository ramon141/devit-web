/// <reference types="vitest/config" />
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// ponytail: o barrel dos models tem milhares de `export *`; no dev cada um vira uma requisição.
// Só arquivos com valor em runtime (enums/consts) precisam ser carregados, tipos são apagados.
function lightModelsBarrel(): Plugin {
  const barrel = path.resolve(import.meta.dirname, 'src/api/generated/models/index.ts')
  const dir = path.dirname(barrel)
  const hasRuntimeValue = (file: string) =>
    /^export (const|enum|function|class)\b/m.test(fs.readFileSync(path.join(dir, `${file}.ts`), 'utf8'))

  return {
    name: 'light-models-barrel',
    enforce: 'pre',
    transform(code, id) {
      if (path.resolve(id) !== barrel) return null

      return code
        .split('\n')
        .filter((line) => {
          const match = line.match(/^export \* from '\.\/(.+)';$/)

          return !match?.[1] || hasRuntimeValue(match[1])
        })
        .join('\n')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    lightModelsBarrel(),
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
