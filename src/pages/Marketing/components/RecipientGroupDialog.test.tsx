import { describe, expect, it, vi } from 'vitest'
import {
  getAddressControllerFindMockHandler,
  getPersonControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { renderWithProviders, screen, server, userEvent, waitFor } from '@/test'
import RecipientGroupDialog from '@/pages/Marketing/components/RecipientGroupDialog'
import { makePerson } from '@/pages/Marketing/marketingTestData'

const CONFIRM_BUTTON = /aggiungi \d+ destinatari/i

function renderDialog(optedOutPersonIds: string[], onConfirm = vi.fn()) {
  renderWithProviders(
    <RecipientGroupDialog
      kind="person"
      open
      onOpenChange={vi.fn()}
      isEmail
      optedOutPersonIds={optedOutPersonIds}
      onConfirm={onConfirm}
    />,
  )

  return onConfirm
}

describe('Marketing: diálogo de grupo de destinatários', () => {
  it('T230 grupo sem nenhum elegível: confirmar fica desativado e explica o motivo', async () => {
    server.use(
      getAddressControllerFindMockHandler([]),
      getPersonControllerFindMockHandler([
        makePerson({ id: 'p1', name: 'Ana', email: 'ana@x.com' }),
        makePerson({ id: 'p2', name: 'Bia', email: 'bia@x.com' }),
      ]),
    )

    renderDialog(['p1', 'p2'])

    expect(
      await screen.findByText(/2 esclusi: 2 non vogliono ricevere comunicazioni, 0 senza contatto/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: CONFIRM_BUTTON })).toBeDisabled()
  })

  it('T224 candidato sem e-mail aparece como excluído por falta de contato', async () => {
    server.use(
      getAddressControllerFindMockHandler([]),
      getPersonControllerFindMockHandler([
        makePerson({ id: 'p1', name: 'Ana', email: 'ana@x.com' }),
        makePerson({ id: 'p2', name: 'Bia', email: null }),
        makePerson({ id: 'p3', name: 'Caio', email: 'caio@x.com' }),
      ]),
    )

    const onConfirm = renderDialog([])
    const confirm = await screen.findByRole('button', { name: /aggiungi 2 destinatari/i })

    expect(screen.getByText(/1 esclusi: 0 non vogliono ricevere comunicazioni, 1 senza contatto/i)).toBeInTheDocument()

    await userEvent.setup().click(confirm)
    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith(['p1', 'p3']))
  })
})
