import type { ReactElement, ReactNode } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { PageHeaderProvider } from '@/contexts/PageHeaderContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { createTestQueryClient } from './queryClient'

interface ProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

// Espelha a árvore de providers do App (MemoryRouter no lugar de BrowserRouter):
// Router -> QueryClient -> Toast -> Tooltip -> PageHeader.
// Use para testes de página/integração.
export const renderWithProviders = (
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: ProvidersOptions = {},
) => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TooltipProvider>
            <PageHeaderProvider>{children}</PageHeaderProvider>
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) }
}
