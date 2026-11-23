import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen, server, userEvent, waitFor, within } from '@/test'
import Vendite from '@/pages/Operazioni/Vendite'
import { makeSale, mockDelete, mockSaleList } from '@/pages/Operazioni/operazioniTestData'
import type { SaleWithRelations } from '@/api/generated/models'

async function renderList(sales: SaleWithRelations[]) {
  server.use(...mockSaleList(() => sales))
  renderWithProviders(<Vendite />)

  await screen.findByText(sales[0]?.number ?? '')
}

describe('Vendite: lista', () => {
  it('T169 25 vendas viram 3 páginas (10, 10 e 5) com valores em euro', async () => {
    const sales = Array.from({ length: 25 }, (_, index) =>
      makeSale({ id: `s${index}`, number: `V-${index + 1}`, finalAmount: 950 }),
    )

    sales[0] = makeSale({ id: 's0', number: 'V-1', finalAmount: 1250000 })
    sales[1] = makeSale({ id: 's1', number: 'V-2', finalAmount: 87500.5 })
    await renderList(sales)

    const user = userEvent.setup()

    expect(screen.getByText(/Pagina 1 di 3 · 25 risultati/)).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(11)
    expect(screen.getByText('1.250.000,00 €')).toBeInTheDocument()
    expect(screen.getByText('87.500,50 €')).toBeInTheDocument()
    expect(screen.getAllByText('950,00 €')).toHaveLength(8)

    const [previous, next] = screen.getAllByRole('button').slice(-2)

    expect(previous).toBeDisabled()
    await user.click(next as HTMLElement)
    await screen.findByText(/Pagina 2 di 3/)
    await waitFor(() => expect(screen.getByText('V-11')).toBeInTheDocument())
    await user.click(screen.getAllByRole('button').slice(-1)[0] as HTMLElement)
    await screen.findByText(/Pagina 3 di 3/)
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(6))
  })

  it('T170 venda sem valor mostra traço; valor 0 mostra 0,00 €', async () => {
    const noAmount = makeSale({ id: 'a', number: 'SEM-VALOR', finalAmount: undefined })

    await renderList([noAmount, makeSale({ id: 'b', number: 'ZERO', finalAmount: 0 })])

    const rowOf = (number: string) => screen.getByText(number).closest('tr')!

    expect(within(rowOf('SEM-VALOR')).queryByText('0,00 €')).not.toBeInTheDocument()
    expect(within(rowOf('SEM-VALOR')).queryByText(/NaN/)).not.toBeInTheDocument()
    expect(within(rowOf('ZERO')).getByText('0,00 €')).toBeInTheDocument()
  })

  it('T171 valor de 1 centavo e de 1 bilhão sem arredondar', async () => {
    await renderList([
      makeSale({ id: 'a', number: 'CENT', finalAmount: 0.01 }),
      makeSale({ id: 'b', number: 'BILHAO', finalAmount: 1000000000 }),
    ])

    expect(screen.getByText('0,01 €')).toBeInTheDocument()
    expect(screen.getByText('1.000.000.000,00 €')).toBeInTheDocument()
  })

  it('T174 corretor aparece com código, sem código ou com traço', async () => {
    const property = (broker?: { fullName: string; brokerCode?: string }) =>
      ({ ...makeSale().property, code: 'AP', responsibleBroker: broker }) as SaleWithRelations['property']

    await renderList([
      makeSale({ id: 'a', number: 'N1', property: property({ fullName: 'Ana Rossi', brokerCode: 'C07' }) }),
      makeSale({ id: 'b', number: 'N2', property: property({ fullName: 'Luca Verdi' }) }),
      makeSale({ id: 'c', number: 'N3', property: property(undefined) }),
    ])

    expect(screen.getByText('C07 - Ana Rossi')).toBeInTheDocument()
    expect(screen.getByText('Luca Verdi')).toBeInTheDocument()

    const brokerCell = (number: string) => within(screen.getByText(number).closest('tr')!)

    expect(brokerCell('N3').getAllByText('—').length).toBeGreaterThan(0)
  })

  it('T175 data à meia-noite universal aparece como 05/03/2026', async () => {
    await renderList([makeSale({ saleDate: '2026-03-05T00:00:00.000Z' })])

    expect(screen.getByText('05/03/2026')).toBeInTheDocument()
    expect(screen.queryByText('04/03/2026')).not.toBeInTheDocument()
  })

  it('T177 excluir venda pede confirmação e o total diminui em 1', async () => {
    let sales = [
      makeSale({ id: 'a', number: 'V-A' }),
      makeSale({ id: 'b', number: 'V-B' }),
    ]
    const deleted: string[] = []

    server.use(
      ...mockSaleList(() => sales),
      mockDelete('*/sales/:id', (id) => {
        deleted.push(id)
        sales = sales.filter((sale) => sale.id !== id)
      }),
    )
    renderWithProviders(<Vendite />)
    await screen.findByText(/2 risultati/)

    const user = userEvent.setup()
    const row = screen.getByText('V-A').closest('tr')!

    await user.click(within(row).getAllByRole('button')[1] as HTMLElement)
    expect(await screen.findByText('Eliminare la vendita?')).toBeInTheDocument()
    expect(deleted).toEqual([])

    await user.click(screen.getByRole('button', { name: 'Elimina' }))

    await waitFor(() => expect(deleted).toEqual(['a']))
    await screen.findByText(/1 risultato/)
    expect(screen.queryByText('V-A')).not.toBeInTheDocument()
  })
})
