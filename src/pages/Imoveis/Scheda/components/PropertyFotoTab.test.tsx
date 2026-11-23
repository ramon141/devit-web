import { describe, expect, it } from 'vitest'
import type { PatchInfo } from '@/pages/mswInfoTypes'
import type { PropertyPhotoWithRelations } from '@/api/generated/models'
import {
  getAttachmentControllerCreateMockHandler,
  getAttachmentControllerCreateResponseMock,
  getPropertyPhotoControllerCreateMockHandler,
  getPropertyPhotoControllerCreateResponseMock,
  getPropertyPhotoControllerFindMockHandler,
  getPropertyPhotoControllerUpdateByIdMockHandler,
} from '@/api/generated/api.msw'
import { apiError, screen, server, userEvent, waitFor } from '@/test'
import {
  fakeFile,
  realJpg,
  realPng,
  realWebp,
  renderFicha,
} from '@/pages/Imoveis/Scheda/test/fichaTestUtils'
import PropertyFotoTab from '@/pages/Imoveis/Scheda/components/PropertyFotoTab'

const PROPERTY_ID = 'p1'

function photo(id: string, cover: boolean, name = `${id}.jpg`) {
  return {
    id,
    propertyId: PROPERTY_ID,
    cover,
    attachment: { id: `a-${id}`, url: `http://files/${id}`, originalName: name },
  } as PropertyPhotoWithRelations
}

function mockUploads() {
  const uploaded: string[] = []
  const linked: string[] = []

  server.use(
    getAttachmentControllerCreateMockHandler(async ({ request }) => {
      const body = (await request.json()) as { originalName: string }
      uploaded.push(body.originalName)

      return getAttachmentControllerCreateResponseMock({ id: `att-${uploaded.length}` })
    }),
    getPropertyPhotoControllerCreateMockHandler(async ({ request }) => {
      const body = (await request.json()) as { attachmentId: string }
      linked.push(body.attachmentId)

      return getPropertyPhotoControllerCreateResponseMock({ id: `ph-${linked.length}` })
    }),
  )

  return { uploaded, linked }
}

function fileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe('PropertyFotoTab', () => {
  it('T129 aceita fotos PNG, JPG e WebP verdadeiras', async () => {
    const { uploaded } = mockUploads()
    server.use(getPropertyPhotoControllerFindMockHandler([]))

    renderFicha(<PropertyFotoTab propertyId={PROPERTY_ID} />)
    await userEvent.setup().upload(fileInput(), [realPng(), realJpg(), realWebp()])

    expect(await screen.findByText('Foto caricate')).toBeInTheDocument()
    expect(uploaded.sort()).toEqual(['foto.jpg', 'foto.png', 'foto.webp'])
  })

  it('T130 recusa foto .jpg com conteúdo de outro tipo e não envia nada', async () => {
    const { uploaded } = mockUploads()
    server.use(getPropertyPhotoControllerFindMockHandler([]))

    renderFicha(<PropertyFotoTab propertyId={PROPERTY_ID} />)
    await userEvent.setup().upload(fileInput(), fakeFile('foto.jpg', 'image/jpeg'))

    expect(
      await screen.findByText('Il contenuto del file non corrisponde al tipo dichiarato.'),
    ).toBeInTheDocument()
    expect(uploaded).toEqual([])
  })

  it('T133 envia 20 fotos; com uma recusada pelo servidor mostra erro e não sucesso', async () => {
    const { uploaded } = mockUploads()
    server.use(getPropertyPhotoControllerFindMockHandler([]))
    const files = Array.from({ length: 20 }, (_, i) => realJpg(`f${i}.jpg`))

    const first = renderFicha(<PropertyFotoTab propertyId={PROPERTY_ID} />)
    await userEvent.setup().upload(fileInput(), files)

    expect(await screen.findByText('Foto caricate')).toBeInTheDocument()
    expect(uploaded).toHaveLength(20)
    first.unmount()

    server.use(apiError('*/attachments', 422, { error: { statusCode: 422, message: 'Rifiutata' } }))
    renderFicha(<PropertyFotoTab propertyId={PROPERTY_ID} />)
    await userEvent.setup().upload(fileInput(), files)

    expect(await screen.findByText('Rifiutata')).toBeInTheDocument()
    expect(screen.queryByText('Foto caricate')).not.toBeInTheDocument()
  })

  it('T134 marcar a foto B como capa tira a capa da foto A', async () => {
    const patched: Record<string, boolean> = {}

    server.use(
      getPropertyPhotoControllerFindMockHandler([photo('A', true), photo('B', false)]),
      getPropertyPhotoControllerUpdateByIdMockHandler(async ({ request, params }: PatchInfo) => {
        const body = (await request.json()) as { cover: boolean }
        patched[String(params.id)] = body.cover

        return undefined
      }),
    )

    renderFicha(<PropertyFotoTab propertyId={PROPERTY_ID} />)
    await screen.findByText('B.jpg')

    await userEvent.setup().click(screen.getAllByTitle('Imposta come copertina')[1] as HTMLElement)

    await waitFor(() => expect(patched).toEqual({ A: false, B: true }))
    expect(await screen.findByText('Copertina aggiornata')).toBeInTheDocument()
  })

  it.skip('T135 reordenar fotos arrastando: a tela não tem reordenação de fotos', () => {})

  it('T136 sem fotos mostra a mensagem de galeria vazia', async () => {
    server.use(getPropertyPhotoControllerFindMockHandler([]))

    renderFicha(<PropertyFotoTab propertyId={PROPERTY_ID} />)

    expect(await screen.findByText('Nessuna foto caricata')).toBeInTheDocument()
  })
})
