import type { ReactNode } from 'react'
import { renderHook } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { PageHeaderProvider } from '@/contexts/PageHeaderContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { createTestQueryClient } from './queryClient'

interface HookRoute {
  /** Padrão da rota (ex.: /clienti/:id) e endereço atual (ex.: /clienti/5), para hooks que leem parâmetros da URL. */
  pattern: string
  path: string
}

// Mesma árvore de providers do renderWithProviders, para testar hooks que usam API e toasts.
export const renderHookWithProviders = <Result,>(callback: () => Result, route?: HookRoute) => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route?.path ?? '/']}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TooltipProvider>
            <PageHeaderProvider>
              {route ? (
                <Routes>
                  <Route path={route.pattern} element={children} />
                </Routes>
              ) : (
                children
              )}
            </PageHeaderProvider>
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )

  return { queryClient, ...renderHook(callback, { wrapper: Wrapper }) }
}
