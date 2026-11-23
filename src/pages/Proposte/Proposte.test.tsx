import { describe, expect, it, vi } from 'vitest'
import type { PathParams } from 'msw'
import { Route, Routes } from 'react-router'
import {
  getPurchaseProposalControllerConvertToSaleMockHandler,
  getPurchaseProposalControllerDeleteByIdMockHandler,
  getPurchaseProposalControllerCountMockHandler,
  getPurchaseProposalControllerFindMockHandler,
  getSaleControllerFindResponseMock,
} from '@/api/generated/api.msw'
import {
  getPurchaseProposalControllerCountQueryKey,
  getPurchaseProposalControllerFindQueryKey,
} from '@/api/generated/api'
import type { PurchaseProposalWithRelations, Sale } from '@/api/generated/models'
import ToastViewport from '@/components/ToastViewport'
import { apiError, renderWithProviders, screen, server, userEvent, waitFor, within } from '@/test'
import Proposte from '@/pages/Proposte'
import {
  makeProposal,
  pickOption,
  rowButtons,
  setupCatalogServer,
  setupProposalsServer,
} from '@/pages/Proposte/proposteTestHelpers'

function renderWithSalesRoute() {
  return renderWithProviders(
    <>
      <Routes>
        <Route path="/" element={<Proposte />} />
        <Route path="/gestionale/operazioni/vendite" element={<p>Pagina vendite</p>} />
      </Routes>
      <ToastViewport />
    </>,
  )
}

function acceptedProposal() {
  return makeProposal({ status: 'accepted', sale: undefined })
}

async function openConvertConfirmation(number = 'PROP-0001') {
  const user = userEvent.setup()

  await screen.findByText(number)
  await user.click(rowButtons(number)[0] as HTMLElement)

  return { user, confirm: await screen.findByRole('button', { name: 'Converti' }) }
}

describe('Proposte: conversão em venda', () => {
  it('T160 converte a proposta aceita, avisa, leva às vendas e atualiza as contagens', async () => {
    setupProposalsServer([acceptedProposal()])
    server.use(getPurchaseProposalControllerConvertToSaleMockHandler(getSaleControllerFindResponseMock()[0]))
    const { queryClient } = renderWithSalesRoute()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { user, confirm } = await openConvertConfirmation()

    await user.click(confirm)

    expect(await screen.findByText('Pagina vendite')).toBeInTheDocument()
    expect(await screen.findByText('Proposta convertita in vendita')).toBeInTheDocument()
    const keys = invalidate.mock.calls.map(([filters]) => filters?.queryKey)

    expect(keys).toContainEqual(getPurchaseProposalControllerCountQueryKey())
    expect(keys).toContainEqual(getPurchaseProposalControllerFindQueryKey())
  })

  it('T161 mostra a mensagem do servidor e permanece na proposta quando a conversão é recusada', async () => {
    setupProposalsServer([acceptedProposal()])
    server.use(
      apiError('*/purchase-proposals/:id/convert-to-sale', 422, {
        error: { statusCode: 422, message: 'Imóvel já vendido' },
      }),
    )
    renderWithSalesRoute()
    const { user, confirm } = await openConvertConfirmation()

    await user.click(confirm)

    expect(await screen.findByText('Imóvel já vendido')).toBeInTheDocument()
    expect(screen.queryByText('Pagina vendite')).not.toBeInTheDocument()
    expect(screen.getByText('PROP-0001')).toBeInTheDocument()
  })

  it('T162 cria apenas uma venda com duplo clique em "Converti"', async () => {
    let calls = 0
    setupProposalsServer([acceptedProposal()])
    server.use(
      getPurchaseProposalControllerConvertToSaleMockHandler(() => {
        calls += 1

        return getSaleControllerFindResponseMock()[0] as Sale
      }),
    )
    renderWithSalesRoute()
    const { user, confirm } = await openConvertConfirmation()

    await user.dblClick(confirm)
    await screen.findByText('Pagina vendite')

    expect(calls).toBe(1)
  })
})

function fiveProposals(): PurchaseProposalWithRelations[] {
  return ['A', 'B', 'C', 'D', 'E'].map((letter, index) =>
    makeProposal({ id: `p${index}`, number: `PROP-000${letter}`, status: 'received' }),
  )
}

describe('Proposte: lista', () => {
  it('T164 pede confirmação ao excluir e atualiza lista e contador para 4', async () => {
    let proposals = fiveProposals()
    server.use(
      getPurchaseProposalControllerFindMockHandler(() => proposals),
      getPurchaseProposalControllerCountMockHandler(() => ({ count: proposals.length })),
      getPurchaseProposalControllerDeleteByIdMockHandler(({ params }: { params: PathParams }) => {
        proposals = proposals.filter((proposal) => proposal.id !== params.id)
      }),
    )
    setupCatalogServer()
    renderWithSalesRoute()
    const user = userEvent.setup()

    expect(await screen.findByText(/5 risultati/)).toBeInTheDocument()
    await user.click(rowButtons('PROP-000C').at(-1) as HTMLElement)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/PROP-000C/)).toBeInTheDocument()
    expect(proposals).toHaveLength(5)

    await user.click(within(dialog).getByRole('button', { name: 'Elimina' }))

    expect(await screen.findByText(/4 risultati/)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('PROP-000C')).not.toBeInTheDocument())
    expect(screen.getAllByRole('row')).toHaveLength(5)
  })

  it('T165 cada status mostra só as suas propostas e a soma fecha com o total', async () => {
    const all = [
      makeProposal({ id: '1', number: 'PROP-R1', status: 'received' }),
      makeProposal({ id: '2', number: 'PROP-R2', status: 'received' }),
      makeProposal({ id: '3', number: 'PROP-N1', status: 'negotiating' }),
      makeProposal({ id: '4', number: 'PROP-A1', status: 'accepted' }),
      makeProposal({ id: '5', number: 'PROP-X1', status: 'rejected' }),
      makeProposal({ id: '6', number: 'PROP-X2', status: 'rejected' }),
    ]
    setupProposalsServer(all)
    renderWithSalesRoute()
    const user = userEvent.setup()
    let sum = 0

    expect(await screen.findByText(/6 risultati/)).toBeInTheDocument()

    for (const [label, prefix, count] of [
      ['Ricevuta', 'PROP-R', 2],
      ['In trattativa', 'PROP-N', 1],
      ['Accettata', 'PROP-A', 1],
      ['Rifiutata', 'PROP-X', 2],
    ] as const) {
      await pickOption(user, 'proposte-status-filter', label)

      await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(count + 1))
      expect(screen.getAllByText(new RegExp(`^${prefix}`))).toHaveLength(count)
      sum += count
    }

    expect(sum).toBe(all.length)
  })

  it('T166 mostra mensagem de lista vazia sem erro e sem carregamento infinito', async () => {
    setupProposalsServer([])
    renderWithSalesRoute()

    expect(await screen.findByText('Nessuna proposta trovata.')).toBeInTheDocument()
    expect(screen.getByText(/0 risultati/)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

