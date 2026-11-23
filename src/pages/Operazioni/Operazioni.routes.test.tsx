import { describe, expect, it, vi } from 'vitest'
import { Outlet, useLocation } from 'react-router'
import { renderWithProviders, screen, waitFor } from '@/test'
import { UserInfo } from '@/auth'
import AppRoutes from '@/routes'

// O menu lateral não faz parte da regra; um Outlet basta para testar o redirecionamento
vi.mock('@/components/layout/Shell', () => ({ default: () => <Outlet /> }))

function Spy() {
  const location = useLocation()

  return <p data-testid="path">{location.pathname}</p>
}

describe('Operações: rotas', () => {
  it('T168 endereço geral de Operações leva à lista de Vendas', async () => {
    UserInfo.setUserId('u1')
    renderWithProviders(
      <>
        <Spy />
        <AppRoutes />
      </>,
      { initialEntries: ['/gestionale/operazioni'] },
    )

    await waitFor(
      () => expect(screen.getByTestId('path')).toHaveTextContent('/gestionale/operazioni/vendite'),
      { timeout: 30000 },
    )
    expect(screen.queryByText(/errore/i)).not.toBeInTheDocument()
  }, 40000)
})
