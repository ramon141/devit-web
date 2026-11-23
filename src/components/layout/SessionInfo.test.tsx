import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { renderWithProviders, screen, server, userEvent, waitFor } from '@/test'
import { seedSession, stubLocation } from '@/test/accessHelpers'
import SessionInfo from '@/components/layout/SessionInfo'

describe('SessionInfo', () => {
  it('T019 Sair avisa o servidor, apaga os dados locais e volta ao login', async () => {
    let logoutCalls = 0
    const location = stubLocation()

    server.use(
      http.post('*/auth/logout', () => {
        logoutCalls += 1

        return HttpResponse.json({})
      }),
    )
    seedSession()
    renderWithProviders(<SessionInfo />)

    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /Admin Devit/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'Esci' }))

    await waitFor(() => expect(logoutCalls).toBe(1))
    expect(localStorage.getItem('userId')).toBeNull()
    expect(localStorage.getItem('fullName')).toBeNull()
    expect(location.href).toBe('/gestionale/login')
  })
})
