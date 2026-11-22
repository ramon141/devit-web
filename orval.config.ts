import { defineConfig } from 'orval'

const OPENAPI_URL = 'http://127.0.0.1:3006/openapi.json'

export default defineConfig({
  api: {
    input: {
      target: OPENAPI_URL,
    },
    output: {
      mode: 'split',
      target: './src/api/generated/api.ts',
      schemas: './src/api/generated/models',
      client: 'react-query',
      prettier: true,
      // Servidor falso dos testes (Vitest): um handler por rota, com dados faker
      mock: {
        type: 'msw',
      },
      override: {
        mock: {
          required: true,
          delay: false,
        },
        mutator: {
          path: './src/api/mutator.ts',
          name: 'mutator',
        },
        queryOptions: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'offset',
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
  // Regras de conferência (zod) só dos corpos de envio: o servidor falso dos testes
  // recusa o que a API recusaria
  zod: {
    input: {
      target: OPENAPI_URL,
    },
    output: {
      mode: 'single',
      client: 'zod',
      target: './src/api/generated/api.zod.ts',
      fileExtension: '.zod.ts',
      override: {
        zod: {
          generate: {
            body: true,
            param: false,
            query: false,
            header: false,
            response: false,
          },
          strict: {
            body: true,
          },
        },
      },
    },
  },
})
