import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { apiError, renderWithProviders, screen, server, userEvent, waitFor } from '@/test'
import ResetPassword from '@/pages/ResetPassword'

const PASSWORD_FIELD = 'Nuova password'
const CONFIRM_FIELD = 'Conferma nuova password'
const SUBMIT = 'Reimposta password'

async function fillReset(password: string, confirm: string) {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText(PASSWORD_FIELD), password)
  await user.type(screen.getByLabelText(CONFIRM_FIELD), confirm)
  await user.click(screen.getByRole('button', { name: SUBMIT }))
}

function renderReset(token = 'tok123') {
  return renderWithProviders(<ResetPassword />, {
    initialEntries: [`/gestionale/reset-password?token=${token}`],
  })
}

const WEAK_PASSWORDS = [
  ['sem maiúscula', 'abcdef1!', 'almeno una lettera maiuscola'],
  ['sem minúscula', 'ABCDEF1!', 'almeno una lettera minuscola'],
  ['sem número', 'Abcdefg!', 'almeno un numero'],
  ['sem símbolo', 'Abcdefg1', 'almeno un carattere speciale'],
  ['com 7 caracteres', 'Abcde1!', 'almeno 8 caratteri'],
]

describe('ResetPassword', () => {
  it.each(WEAK_PASSWORDS)('T023 senha %s mostra o aviso específico', async (_name, pwd, warning) => {
    let count = 0

    server.use(
      http.post('*/auth/reset-password', () => {
        count += 1

        return HttpResponse.json({})
      }),
    )
    renderReset()
    await fillReset(pwd, pwd)

    expect(await screen.findByText(new RegExp(warning))).toBeInTheDocument()
    expect(count).toBe(0)
  })

  it('T024 confirmação diferente mostra aviso no campo de confirmação e barra o envio', async () => {
    let count = 0

    server.use(
      http.post('*/auth/reset-password', () => {
        count += 1

        return HttpResponse.json({})
      }),
    )
    renderReset()
    await fillReset('Abcdef1!', 'Abcdef1?')

    const warning = await screen.findByText('Le password non coincidono')

    expect(warning.previousElementSibling).toBe(screen.getByLabelText(CONFIRM_FIELD))
    expect(count).toBe(0)
  })

  it('T025 link vencido ou usado mostra a mensagem do servidor', async () => {
    server.use(
      apiError('*/auth/reset-password', 422, {
        error: { statusCode: 422, message: 'Link scaduto o già utilizzato' },
      }),
    )
    renderReset()
    await fillReset('Abcdef1!', 'Abcdef1!')

    expect(await screen.findByText('Link scaduto o già utilizzato')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SUBMIT })).toBeEnabled()
    expect(screen.getByLabelText(PASSWORD_FIELD)).toBeInTheDocument()
  })

  it('T025 senha forte e confirmada envia o token do link com a nova senha', async () => {
    let sentBody = ''

    server.use(
      http.post('*/auth/reset-password', async ({ request }) => {
        sentBody = await request.text()

        return HttpResponse.json({})
      }),
    )
    renderReset('abc-token')
    await fillReset('Abcdef1!', 'Abcdef1!')

    await waitFor(() => expect(sentBody).not.toBe(''))
    expect(JSON.parse(sentBody)).toEqual({ token: 'abc-token', password: 'Abcdef1!' })
  })
})
