import { describe, expect, it } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import { renderWithProviders, screen, server, userEvent, waitFor } from '@/test'
import ForgotPassword from '@/pages/ForgotPassword'

describe('ForgotPassword', () => {
  it('T022 e-mail válido com servidor lento: botão desativa, um só envio e confirmação', async () => {
    let count = 0
    let sentBody = ''

    server.use(
      http.post('*/auth/forgot-password', async ({ request }) => {
        count += 1
        sentBody = await request.text()
        await delay(300)

        return HttpResponse.json({})
      }),
    )
    renderWithProviders(<ForgotPassword />)

    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: 'Invia link' })

    await user.type(screen.getByPlaceholderText('tu@devit.it'), 'admin@devit.com')
    await user.dblClick(button)

    await waitFor(() => expect(button).toBeDisabled())

    expect(
      await screen.findByText(/riceverai un link per reimpostare la password/),
    ).toBeInTheDocument()
    expect(count).toBe(1)
    expect(JSON.parse(sentBody)).toEqual({ email: 'admin@devit.com' })
  })

  it('T022 e-mail inválido é barrado antes de consultar o servidor', async () => {
    let count = 0

    server.use(
      http.post('*/auth/forgot-password', () => {
        count += 1

        return HttpResponse.json({})
      }),
    )
    renderWithProviders(<ForgotPassword />)

    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('tu@devit.it'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Invia link' }))

    expect(await screen.findByText('E-mail non valida')).toBeInTheDocument()
    expect(count).toBe(0)
  })
})
