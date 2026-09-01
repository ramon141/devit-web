import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from '@/routes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastProvider } from '@/contexts/ToastContext'
import ToastViewport from '@/components/ToastViewport'
import { PromisePopupProvider } from '@/contexts/PromisePopupContext'
import PromisePopup from '@/components/PromisePopup'

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
        <PromisePopupProvider>
          <TooltipProvider>
            <AppRoutes />
            <ToastViewport />
            <PromisePopup />
          </TooltipProvider>
        </PromisePopupProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
