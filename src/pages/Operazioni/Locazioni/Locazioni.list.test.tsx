import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen, server, userEvent, waitFor, within } from '@/test'
import Locazioni from '@/pages/Operazioni/Locazioni'
import { makeContract, mockDelete, mockRentalList } from '@/pages/Operazioni/operazioniTestData'

describe('Locazioni: lista', () => {
  it('T177 excluir locação pede confirmação e o total diminui em 1', async () => {
    let contracts = [
      makeContract({ id: 'a', number: 'L-A' }),
      makeContract({ id: 'b', number: 'L-B' }),
    ]
    const deleted: string[] = []

    server.use(
      ...mockRentalList(() => contracts),
      mockDelete('*/rental-contracts/:id', (id) => {
        deleted.push(id)
        contracts = contracts.filter((contract) => contract.id !== id)
      }),
    )
    renderWithProviders(<Locazioni />)
    await screen.findByText(/2 risultati/)

    const user = userEvent.setup()
    const row = screen.getByText('L-A').closest('tr')!

    await user.click(within(row).getAllByRole('button')[3] as HTMLElement)
    expect(await screen.findByText('Eliminare il contratto?')).toBeInTheDocument()
    expect(deleted).toEqual([])

    await user.click(screen.getByRole('button', { name: 'Elimina' }))

    await waitFor(() => expect(deleted).toEqual(['a']))
    await screen.findByText(/1 risultato/)
    expect(screen.queryByText('L-A')).not.toBeInTheDocument()
  })
})
