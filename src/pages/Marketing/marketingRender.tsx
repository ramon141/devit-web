import type { ReactElement } from 'react'
import ToastViewport from '@/components/ToastViewport'
import { renderWithProviders } from '@/test'

// Renderiza a tela junto do container de avisos (ele fica no layout do app, não no provider).
export function renderWithToasts(ui: ReactElement) {
  return renderWithProviders(
    <>
      {ui}
      <ToastViewport />
    </>,
  )
}
