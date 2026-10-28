import { isAxiosError } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from '@/routes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastProvider } from '@/contexts/ToastContext'
import ToastViewport from '@/components/ToastViewport'

const MAX_QUERY_RETRIES = 3

// Erros 4xx (ex.: registro inexistente) não mudam ao tentar de novo:
// repetir só atrasava a mensagem de "não encontrado" na tela
function shouldRetryQuery(failureCount: number, error: Error) {
  const status = isAxiosError(error) ? error.response?.status : undefined
  if (status && status >= 400 && status < 500) return false

  return failureCount < MAX_QUERY_RETRIES
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: shouldRetryQuery,
      // dados dinâmicos: validade curta; estáveis sobrescrevem na própria query
      staleTime: 30 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TooltipProvider>
          <AppRoutes />
          <ToastViewport />
        </TooltipProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
