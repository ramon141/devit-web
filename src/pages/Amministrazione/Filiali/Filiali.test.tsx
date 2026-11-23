import { describe, expect, it } from 'vitest'
import {
  getBranchControllerCountMockHandler,
  getBranchControllerFindMockHandler,
  getBranchControllerFindResponseMock,
} from '@/api/generated/api.msw'
import { apiError, screen, server, userEvent } from '@/test'
import { renderAdmin, rowButton, rowOf, first } from '@/pages/Amministrazione/adminTestUtils'
import Filiali from '@/pages/Amministrazione/Filiali'

function listBranch(name: string) {
  const branch = { ...first(getBranchControllerFindResponseMock()), id: 'b1', name, active: true }

  server.use(
    getBranchControllerFindMockHandler([branch]),
    getBranchControllerCountMockHandler({ count: 1 }),
  )
}

describe('Tela de filiais', () => {
  it('T248 excluir filial com usuários vinculados mostra a recusa e mantém a filial', async () => {
    const user = userEvent.setup()

    listBranch('Filiale Napoli')
    server.use(
      apiError(
        '*/branches/b1',
        409,
        { error: { statusCode: 409, message: 'La filiale ha utenti collegati' } },
        'delete',
      ),
    )
    renderAdmin(<Filiali />)

    await screen.findByText('Filiale Napoli')
    await user.click(rowButton('Filiale Napoli', 1))
    await user.click(await screen.findByRole('button', { name: 'Elimina' }))

    expect(await screen.findByText('La filiale ha utenti collegati')).toBeInTheDocument()
    expect(rowOf('Filiale Napoli')).toBeInTheDocument()
    expect(screen.queryByText('Filiale eliminata con successo!')).not.toBeInTheDocument()
  })

  it('T247 cadastro com nome de 1 letra mostra o aviso e não envia', async () => {
    const user = userEvent.setup()

    listBranch('Filiale Napoli')
    renderAdmin(<Filiali />)

    await user.click(await screen.findByRole('button', { name: 'Nuova filiale' }))
    await user.type(screen.getByPlaceholderText('Filiale Milano Centro'), 'A')
    await user.click(screen.getByRole('button', { name: 'Salva' }))

    expect(await screen.findByText('Inserisci almeno 2 caratteri')).toBeInTheDocument()
    expect(screen.queryByText('Creazione filiale...')).not.toBeInTheDocument()
  })
})
