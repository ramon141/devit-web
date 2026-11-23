import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getHomeVideoControllerCurrentMockHandler,
  getHomeVideoControllerRemoveMockHandler,
  getHomeVideoControllerReplaceMockHandler,
  getHomeVideoControllerReplaceResponseMock,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor } from '@/test'
import { renderAdmin } from '@/pages/Amministrazione/adminTestUtils'
import VideoHome from '@/pages/Amministrazione/VideoHome'

const MB = 1024 * 1024
const CUSTOM_VIDEO = {
  id: 'v1',
  url: 'https://cdn.devit.it/home.mp4',
  originalName: 'home.mp4',
  durationSeconds: 30,
  size: 5 * MB,
  updatedAt: '2026-03-10T10:00:00Z',
}

// O jsdom não lê vídeos: simula a leitura dos metadados com a duração desejada
function stubVideoDuration(seconds: number) {
  vi.spyOn(HTMLMediaElement.prototype, 'src', 'set').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    Object.defineProperty(this, 'duration', { value: seconds, configurable: true })
    queueMicrotask(() => this.onloadedmetadata?.(new Event('loadedmetadata')))
  })
}

function makeVideoFile(name: string, type: string, sizeBytes = 1024) {
  // Conteúdo '{}': o servidor de testes lê todo corpo de envio como JSON
  const file = new File(['{}'], name, { type })

  Object.defineProperty(file, 'size', { value: sizeBytes })

  return file
}

// applyAccept desligado: simula arrastar o arquivo, que não passa pelo filtro do seletor
async function chooseFile(file: File) {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')

  if (!input) throw new Error('campo de arquivo não encontrado')

  await userEvent.setup({ applyAccept: false }).upload(input, file)
}

function publishButton() {
  return screen.getByRole('button', { name: 'Pubblica video' })
}

// Estado do servidor: vídeo personalizado publicado ou não
function serveVideoState(initiallyCustom: boolean) {
  const state = { custom: initiallyCustom, replaced: 0, removed: 0 }

  server.use(
    getHomeVideoControllerCurrentMockHandler(() => ({ video: state.custom ? CUSTOM_VIDEO : null })),
    getHomeVideoControllerReplaceMockHandler(() => {
      state.custom = true
      state.replaced += 1

      return getHomeVideoControllerReplaceResponseMock()
    }),
    getHomeVideoControllerRemoveMockHandler(() => {
      state.custom = false
      state.removed += 1

      return undefined
    }),
  )

  return state
}

describe('Tela do vídeo da página inicial', () => {
  beforeEach(() => stubVideoDuration(30))
  afterEach(() => vi.restoreAllMocks())

  it('T258 publicar MP4 válido mostra a prévia, avisa e passa a ser o vídeo personalizado', async () => {
    const state = serveVideoState(false)

    renderAdmin(<VideoHome />)
    expect(await screen.findByText('Video attuale: predefinito')).toBeInTheDocument()
    expect(publishButton()).toBeDisabled()

    await chooseFile(makeVideoFile('novo.mp4', 'video/mp4'))

    expect(await screen.findByText('Anteprima del file scelto: non è ancora pubblicato.')).toBeInTheDocument()
    await userEvent.setup().click(publishButton())

    expect(await screen.findByText('Video pubblicato con successo!')).toBeInTheDocument()
    expect(await screen.findByText('Video attuale del sito')).toBeInTheDocument()
    expect(state.replaced).toBe(1)
    expect(screen.queryByText('Anteprima del file scelto: non è ancora pubblicato.')).not.toBeInTheDocument()
  })

  it('T259 restaurar o padrão pede confirmação e só depois volta ao vídeo padrão', async () => {
    const user = userEvent.setup()
    const state = serveVideoState(true)

    renderAdmin(<VideoHome />)
    await user.click(await screen.findByRole('button', { name: 'Torna al video predefinito' }))

    expect(await screen.findByText('Tornare al video predefinito?')).toBeInTheDocument()
    expect(state.removed).toBe(0)

    await user.click(screen.getByRole('button', { name: 'Ripristina' }))

    expect(await screen.findByText('Video attuale: predefinito')).toBeInTheDocument()
    expect(state.removed).toBe(1)
  })

  it('T259 cancelar a confirmação mantém o vídeo personalizado', async () => {
    const user = userEvent.setup()
    const state = serveVideoState(true)

    renderAdmin(<VideoHome />)
    await user.click(await screen.findByRole('button', { name: 'Torna al video predefinito' }))
    await user.click(await screen.findByRole('button', { name: 'Annulla' }))

    await waitFor(() => expect(screen.queryByText('Tornare al video predefinito?')).not.toBeInTheDocument())
    expect(state.removed).toBe(0)
    expect(screen.getByText('Video attuale del sito')).toBeInTheDocument()
  })
})

describe('Regras do vídeo da página inicial', () => {
  afterEach(() => vi.restoreAllMocks())

  it('T260 arquivo que não é MP4 é recusado e nada pode ser publicado', async () => {
    stubVideoDuration(30)
    serveVideoState(false)
    renderAdmin(<VideoHome />)
    await screen.findByText('Video attuale: predefinito')

    await chooseFile(makeVideoFile('filme.mov', 'video/quicktime'))

    expect(await screen.findAllByText('Tipo di file non consentito')).not.toHaveLength(0)
    expect(publishButton()).toBeDisabled()
  })

  it('T260 MP4 de 41 MB é recusado por tamanho', async () => {
    stubVideoDuration(30)
    serveVideoState(false)
    renderAdmin(<VideoHome />)
    await screen.findByText('Video attuale: predefinito')

    await chooseFile(makeVideoFile('grande.mp4', 'video/mp4', 41 * MB))

    expect(await screen.findAllByText('File troppo grande. Dimensione massima: 40 MB')).not.toHaveLength(0)
    expect(publishButton()).toBeDisabled()
  })

  it('T260 MP4 de 61 segundos é recusado por duração', async () => {
    stubVideoDuration(61)
    serveVideoState(false)
    renderAdmin(<VideoHome />)
    await screen.findByText('Video attuale: predefinito')

    await chooseFile(makeVideoFile('longo.mp4', 'video/mp4'))

    expect(await screen.findByText('Il video supera la durata massima di 60 secondi.')).toBeInTheDocument()
    expect(publishButton()).toBeDisabled()
  })

  it('T260 MP4 de exatamente 40 MB e 60 segundos é aceito', async () => {
    stubVideoDuration(60)
    serveVideoState(false)
    renderAdmin(<VideoHome />)
    await screen.findByText('Video attuale: predefinito')

    await chooseFile(makeVideoFile('limite.mp4', 'video/mp4', 40 * MB))

    await waitFor(() => expect(publishButton()).toBeEnabled())
    expect(screen.queryByText('Il video supera la durata massima di 60 secondi.')).not.toBeInTheDocument()
  })
})
