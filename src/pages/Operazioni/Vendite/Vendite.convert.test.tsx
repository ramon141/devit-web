import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router'
import { renderWithProviders, screen, server, userEvent, within } from '@/test'
import Vendite from '@/pages/Operazioni/Vendite'
import { useConvertProposal } from '@/pages/Proposte/hooks/useConvertProposal'
import { makeSale, mockSaleList } from '@/pages/Operazioni/operazioniTestData'
import type { SaleWithRelations } from '@/api/generated/models'

function ConvertButton() {
  const { convert } = useConvertProposal()

  return <button onClick={() => convert('prop1')}>converter</button>
}

describe('Vendite: venda convertida de proposta', () => {
  it('T176 a venda criada mostra o mesmo comprador, imóvel e valor da proposta', async () => {
    let sales: SaleWithRelations[] = []

    server.use(
      ...mockSaleList(() => sales),
      http.post('*/purchase-proposals/:id/convert-to-sale', () => {
        sales = [
          makeSale({
            number: 'V-PROP',
            finalAmount: 320000,
            buyer: { ...makeSale().buyer, name: 'Mario Bianchi' } as SaleWithRelations['buyer'],
            property: { ...makeSale().property, code: 'AP-12' } as SaleWithRelations['property'],
          }),
        ]

        return HttpResponse.json({ id: 's1' })
      }),
    )

    renderWithProviders(
      <Routes>
        <Route path="/propostas" element={<ConvertButton />} />
        <Route path="/gestionale/operazioni/vendite" element={<Vendite />} />
      </Routes>,
      { initialEntries: ['/propostas'] },
    )

    await userEvent.setup().click(screen.getByText('converter'))

    const row = (await screen.findByText('V-PROP')).closest('tr')!

    expect(within(row).getByText('Mario Bianchi')).toBeInTheDocument()
    expect(within(row).getByText('AP-12')).toBeInTheDocument()
    expect(within(row).getByText('320.000,00 €')).toBeInTheDocument()
  })
})
