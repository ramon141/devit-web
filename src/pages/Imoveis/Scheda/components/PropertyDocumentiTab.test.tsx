import type { DeleteInfo } from '@/pages/mswInfoTypes'
import { describe, expect, it } from 'vitest'
import type { PropertyDocumentWithRelations } from '@/api/generated/models'
import {
  getAttachmentControllerCreateMockHandler,
  getAttachmentControllerCreateResponseMock,
  getPropertyDocumentControllerCreateMockHandler,
  getPropertyDocumentControllerCreateResponseMock,
  getPropertyDocumentControllerDeleteByIdMockHandler,
  getPropertyDocumentControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor } from '@/test'
import { formatDateTime } from '@/utils/formatDate'
import {
  SHEET_TYPE,
  emptyPdf,
  fakeFile,
  realGif87,
  realGif89,
  realPdf,
  realWebp,
  renderFicha,
} from '@/pages/Imoveis/Scheda/test/fichaTestUtils'
import PropertyDocumentiTab from '@/pages/Imoveis/Scheda/components/PropertyDocumentiTab'

const PROPERTY_ID = 'p1'
const MISMATCH = 'Il contenuto del file non corrisponde al tipo dichiarato.'

function doc(id: string, label: string) {
  return {
    id,
    propertyId: PROPERTY_ID,
    label,
    createdAt: '2026-03-10T10:15:00.000Z',
    attachment: { id: `a-${id}`, url: `http://files/${id}.pdf`, originalName: `${label}.pdf` },
  } as PropertyDocumentWithRelations
}

function mockUploads() {
  const uploaded: string[] = []

  server.use(
    getPropertyDocumentControllerFindMockHandler([]),
    getAttachmentControllerCreateMockHandler(async ({ request }) => {
      const body = (await request.json()) as { originalName: string }
      uploaded.push(body.originalName)

      return getAttachmentControllerCreateResponseMock({ id: `att-${uploaded.length}` })
    }),
    getPropertyDocumentControllerCreateMockHandler(getPropertyDocumentControllerCreateResponseMock({ id: 'd1' })),
  )

  return uploaded
}

function fileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe('PropertyDocumentiTab', () => {
  it('T131 aceita PDF verdadeiro e recusa texto renomeado para PDF', async () => {
    const uploaded = mockUploads()
    const user = userEvent.setup()

    renderFicha(<PropertyDocumentiTab propertyId={PROPERTY_ID} />)
    await user.upload(fileInput(), realPdf())

    expect(await screen.findByText('Documenti caricati')).toBeInTheDocument()
    expect(uploaded).toEqual(['contrato.pdf'])

    await user.upload(fileInput(), fakeFile('contrato.pdf', 'application/pdf'))

    expect(await screen.findByText(MISMATCH)).toBeInTheDocument()
    expect(uploaded).toEqual(['contrato.pdf'])
  })

  it('T132 recusa arquivo vazio declarado como PDF', async () => {
    const uploaded = mockUploads()

    renderFicha(<PropertyDocumentiTab propertyId={PROPERTY_ID} />)
    await userEvent.setup().upload(fileInput(), emptyPdf())

    expect(await screen.findByText(MISMATCH)).toBeInTheDocument()
    expect(uploaded).toEqual([])
  })

  it('T137 documento anexado aparece com nome e data e o link abre o arquivo certo', async () => {
    server.use(getPropertyDocumentControllerFindMockHandler([doc('d1', 'Escritura')]))

    renderFicha(<PropertyDocumentiTab propertyId={PROPERTY_ID} />)

    expect(await screen.findByText('Escritura')).toBeInTheDocument()
    expect(screen.getByText(formatDateTime('2026-03-10T10:15:00.000Z'))).toBeInTheDocument()

    const link = document.querySelector('a[href]') as HTMLAnchorElement
    expect(link).toHaveAttribute('href', 'http://files/d1.pdf')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('T138 excluir documento pede confirmação e a lista fica só com o outro', async () => {
    let stored = [doc('d1', 'Primeiro'), doc('d2', 'Segundo')]
    const deleted: string[] = []

    server.use(
      getPropertyDocumentControllerFindMockHandler(() => stored),
      getPropertyDocumentControllerDeleteByIdMockHandler(({ params }: DeleteInfo) => {
        deleted.push(String(params.id))
        stored = stored.filter((item) => item.id !== params.id)

        return undefined
      }),
    )

    const user = userEvent.setup()
    renderFicha(<PropertyDocumentiTab propertyId={PROPERTY_ID} />)
    await screen.findByText('Primeiro')

    const firstRow = screen.getByText('Primeiro').closest('.ring-1') as HTMLElement
    const trash = firstRow.querySelectorAll('button')[0] as HTMLButtonElement
    await user.click(trash)

    expect(await screen.findByText(/Questa azione eliminerà definitivamente "Primeiro"/)).toBeInTheDocument()
    expect(deleted).toEqual([])

    await user.click(screen.getByRole('button', { name: 'Elimina' }))

    await waitFor(() => expect(deleted).toEqual(['d1']))
    await waitFor(() => expect(screen.queryByText('Primeiro')).not.toBeInTheDocument())
    expect(screen.getByText('Segundo')).toBeInTheDocument()
  })

  it('T146 aceita GIF (87a e 89a) e WebP verdadeiros e deixa passar planilha sem verificação', async () => {
    const uploaded = mockUploads()

    const sheet = fakeFile('planilha.xlsx', SHEET_TYPE)

    renderFicha(<PropertyDocumentiTab propertyId={PROPERTY_ID} />)
    await userEvent.setup().upload(fileInput(), [realGif87(), realGif89(), realWebp(), sheet])

    expect(await screen.findByText('Documenti caricati')).toBeInTheDocument()
    expect(uploaded.sort()).toEqual(['foto.webp', 'foto87.gif', 'foto89.gif', 'planilha.xlsx'])
  })
})
