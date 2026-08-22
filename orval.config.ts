import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: 'http://127.0.0.1:3006/openapi.json',
    },
    output: {
      mode: 'split',
      target: './src/api/generated/api.ts',
      schemas: './src/api/generated/models',
      client: 'react-query',
      prettier: true,
      override: {
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
})
