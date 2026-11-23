import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import AppRoutes from '@/routes'
import { ToastProvider } from '@/contexts/ToastContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { createTestQueryClient, screen, waitFor } from '@/test'
import { currentPath } from '@/test/accessHelpers'
import { LocationProbe } from '@/test/LocationProbe'

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <QueryClientProvider client={createTestQueryClient()}>
        <ToastProvider>
          <TooltipProvider>
            <AppRoutes />
            <LocationProbe />
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

const WELCOME_WORD = 'Benvenuto'

describe('rotas protegidas', () => {
  it('T016 abrir tela interna sem sessão leva ao login sem mostrar o conteúdo', async () => {
    renderApp('/gestionale/proprieta')

    await waitFor(() => expect(currentPath()).toBe('/gestionale/login'))
    expect(screen.getByRole('button', { name: /accedi/i })).toBeInTheDocument()
    expect(screen.queryByText(WELCOME_WORD)).not.toBeInTheDocument()
  })

  it('T016 o mesmo vale para outras telas internas (agenda, usuários)', async () => {
    for (const path of ['/gestionale/agenda', '/gestionale/amministrazione/utenti']) {
      const { unmount } = renderApp(path)

      await waitFor(() => expect(currentPath()).toBe('/gestionale/login'))
      unmount()
    }
  })
})
