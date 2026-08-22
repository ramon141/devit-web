import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: './openapi.json', // TODO: point at your OpenAPI spec (file path or URL)
    output: {
      target: './src/api/generated.ts',
      client: 'fetch',
      mode: 'tags-split',
    },
  },
})
