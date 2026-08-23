import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from '@/routes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastProvider } from '@/contexts/ToastContext'
import ToastViewport from '@/components/ToastViewport'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
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
