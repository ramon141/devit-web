import { QueryClient } from '@tanstack/react-query'

// QueryClient para testes: sem retry (uma falha é uma falha, não 3 tentativas
// que atrasam o teste)
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
