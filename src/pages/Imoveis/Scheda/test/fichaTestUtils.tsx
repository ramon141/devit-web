import type { ReactElement } from 'react'
import ToastViewport from '@/components/ToastViewport'
import { PropertyDraftProvider } from '@/pages/Imoveis/contexts/PropertyDraftProvider'
import { renderWithProviders } from '@/test'

// Renderiza uma peça da ficha com rascunho e área de avisos (toasts) visíveis
export function renderFicha(ui: ReactElement, initialEntries?: string[]) {
  return renderWithProviders(
    <PropertyDraftProvider>
      {ui}
      <ToastViewport />
    </PropertyDraftProvider>,
    { initialEntries },
  )
}

const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0]
const GIF89_HEADER = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]
const GIF87_HEADER = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]
const WEBP_HEADER = [0x52, 0x49, 0x46, 0x46, 0x10, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]
const PDF_HEADER = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]
const PADDING = [1, 2, 3, 4, 5, 6, 7, 8]

function makeFile(header: number[], name: string, type: string) {
  return new File([new Uint8Array([...header, ...PADDING])], name, { type })
}

export const realPng = (name = 'foto.png') => makeFile(PNG_HEADER, name, 'image/png')
export const realJpg = (name = 'foto.jpg') => makeFile(JPEG_HEADER, name, 'image/jpeg')
export const realWebp = (name = 'foto.webp') => makeFile(WEBP_HEADER, name, 'image/webp')
export const realGif89 = (name = 'foto89.gif') => makeFile(GIF89_HEADER, name, 'image/gif')
export const realGif87 = (name = 'foto87.gif') => makeFile(GIF87_HEADER, name, 'image/gif')
export const realPdf = (name = 'contrato.pdf') => makeFile(PDF_HEADER, name, 'application/pdf')

// Arquivo que se diz de um tipo mas tem conteúdo de texto
export const fakeFile = (name: string, type: string) =>
  new File([new TextEncoder().encode('isto e apenas texto')], name, { type })

export const emptyPdf = () => new File([], 'vazio.pdf', { type: 'application/pdf' })

export const SHEET_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
