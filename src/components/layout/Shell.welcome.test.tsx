import { describe, expect, it, vi } from 'vitest'
import { Route, Routes } from 'react-router'
import { renderWithProviders, screen, waitFor } from '@/test'
import { markWelcomeScreenPending } from '@/lib/welcomeScreenFlag'
import Shell from '@/components/layout/Shell'

// Os layouts reais carregam o menu, a busca e as notificações (muito pesado para este teste);
// aqui só interessa a decisão do Shell de mostrar ou não a boas-vindas.
vi.mock('@/components/layout/DesktopLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}))
vi.mock('@/components/layout/MobileLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}))

const WELCOME_WORD = 'Benvenuto'

function renderShell() {
  return renderWithProviders(
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<p>Conteudo interno</p>} />
      </Route>
    </Routes>,
  )
}

describe('Shell (boas-vindas)', () => {
  it('T014 boas-vindas aparece uma única vez após o login e some sozinha', async () => {
    markWelcomeScreenPending()
    renderShell()

    expect(await screen.findByText(WELCOME_WORD)).toBeInTheDocument()
    expect(sessionStorage.getItem('devit:show-welcome-screen')).toBeNull()

    await waitFor(() => expect(screen.queryByText(WELCOME_WORD)).not.toBeInTheDocument(), {
      timeout: 10000,
    })
    expect(screen.getByText('Conteudo interno')).toBeInTheDocument()
  })

  it('T014 ao recarregar (nova montagem) a boas-vindas não reaparece', async () => {
    markWelcomeScreenPending()

    const first = renderShell()

    expect(await screen.findByText(WELCOME_WORD)).toBeInTheDocument()
    first.unmount()

    renderShell()

    expect(screen.getByText('Conteudo interno')).toBeInTheDocument()
    expect(screen.queryByText(WELCOME_WORD)).not.toBeInTheDocument()
  })
})
