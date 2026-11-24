import { api } from '@/api/mutator'

export type ExportFormat = 'xlsx' | 'pdf'

// Baixa um arquivo de export do backend e dispara o download no navegador.
export async function downloadExport(
  path: string,
  format: ExportFormat,
  params: Record<string, unknown> = {},
): Promise<void> {
  const response = await api.get<Blob>(path, {
    params: { ...params, format },
    responseType: 'blob',
  })

  const disposition = response.headers['content-disposition'] ?? ''
  const match = disposition.match(/filename="?([^"]+)"?/)
  const filename = match?.[1] ?? `export.${format}`

  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Busca o mesmo PDF do export e abre a impressão direto, sem baixar o arquivo.
export async function printExport(
  path: string,
  params: Record<string, unknown> = {},
): Promise<void> {
  const response = await api.get<Blob>(path, {
    params: { ...params, format: 'pdf' },
    responseType: 'blob',
  })

  const url = URL.createObjectURL(response.data)
  const frame = document.createElement('iframe')
  frame.style.display = 'none'
  frame.src = url

  frame.onload = () => {
    frame.contentWindow?.print()
    setTimeout(() => {
      frame.remove()
      URL.revokeObjectURL(url)
    }, 60_000)
  }

  document.body.appendChild(frame)
}
