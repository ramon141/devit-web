import { describe, expect, it } from 'vitest'
import { HttpResponse, http } from 'msw'
import {
  getPurchaseProposalAttachmentControllerCreateMockHandler,
  getPurchaseProposalAttachmentControllerFindMockHandler,
  getPurchaseProposalAttachmentControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type { Attachment, PurchaseProposalAttachmentWithRelations } from '@/api/generated/models'
import { screen, server, waitFor } from '@/test'
import {
  makeProposal,
  openEdit,
  renderProposte,
  setupCatalogServer,
  setupProposalsServer,
} from '@/pages/Proposte/proposteTestHelpers'

function setupAttachmentServer() {
  const saved: PurchaseProposalAttachmentWithRelations[] = []
  const base = getPurchaseProposalAttachmentControllerFindResponseMock()[0] as PurchaseProposalAttachmentWithRelations

  server.use(
    getPurchaseProposalAttachmentControllerFindMockHandler(() => saved),
    // Servidor recusa arquivo cujo conteúdo não confere com o tipo declarado
    http.post('*/attachments', async ({ request }) => {
      const body = (await request.json()) as { originalName: string }

      if (body.originalName === 'falso.pdf') {
        return HttpResponse.json(
          { error: { statusCode: 415, message: 'Il contenuto del file non corrisponde al tipo dichiarato.' } },
          { status: 415 },
        )
      }

      return HttpResponse.json({ id: 'att-1', originalName: body.originalName })
    }),
    getPurchaseProposalAttachmentControllerCreateMockHandler(() => {
      saved.push({
        ...base,
        id: 'link-1',
        attachment: Object.assign({}, base.attachment as Attachment, {
          id: 'att-1',
          url: 'https://files/contrato.pdf',
          originalName: 'contrato.pdf',
        }),
      })

      return { ...base, id: 'link-1' }
    }),
  )

  return saved
}

function fileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe('Proposte: anexos', () => {
  it('T163 lista o arquivo válido e recusa o de conteúdo falso com a mensagem do servidor', async () => {
    const saved = setupAttachmentServer()
    setupCatalogServer()
    setupProposalsServer([makeProposal()])
    renderProposte()
    const user = await openEdit('PROP-0001')

    expect(await screen.findByText('Nessun allegato')).toBeInTheDocument()

    await user.upload(fileInput(), new File(['%PDF-1.4'], 'contrato.pdf', { type: 'application/pdf' }))

    expect(await screen.findByRole('link', { name: 'contrato.pdf' })).toBeInTheDocument()
    expect(saved).toHaveLength(1)

    await user.upload(fileInput(), new File(['isto não é pdf'], 'falso.pdf', { type: 'application/pdf' }))

    expect(await screen.findByText('Il contenuto del file non corrisponde al tipo dichiarato.')).toBeInTheDocument()
    await waitFor(() => expect(saved).toHaveLength(1))
    expect(screen.queryByRole('link', { name: 'falso.pdf' })).not.toBeInTheDocument()
  })
})

