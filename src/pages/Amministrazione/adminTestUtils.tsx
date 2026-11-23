import type { ReactElement } from 'react'
import ToastViewport from '@/components/ToastViewport'
import type { JsonValue } from '@/test/requestBodyValidator'
import { renderWithProviders, screen, userEvent, within } from '@/test'

// Renderiza a tela já com a área de avisos (toasts), que o render padrão não inclui
export function renderAdmin(ui: ReactElement) {
  return renderWithProviders(
    <>
      <ToastViewport />
      {ui}
    </>,
  )
}

// Linha da tabela que contém o texto (a tela roda em modo desktop nos testes)
export function rowOf(text: string): HTMLElement {
  const row = screen.getByText(text).closest('tr')

  if (!row) throw new Error(`Linha não encontrada para "${text}"`)

  return row
}

// Botões de ícone da linha, na ordem em que aparecem (editar, excluir...)
export function rowButtons(text: string): HTMLElement[] {
  return within(rowOf(text)).getAllByRole('button')
}

export async function clickSave() {
  await userEvent.setup().click(screen.getByRole('button', { name: 'Salva' }))
}

export async function typeInto(placeholder: string, value: string) {
  const input = screen.getByPlaceholderText(placeholder)

  await userEvent.setup().clear(input)

  if (value) await userEvent.setup().type(input, value)
}

// Colar é bem mais rápido que digitar (textos longos de limite de tamanho)
export async function pasteInto(placeholder: string, value: string) {
  const user = userEvent.setup()
  const input = screen.getByPlaceholderText(placeholder)

  await user.clear(input)
  await user.click(input)
  await user.paste(value)
}

// Botão de ícone da linha pela posição (0 = editar, 1 = excluir, etc.)
export function rowButton(text: string, index: number): HTMLElement {
  const button = rowButtons(text)[index]

  if (!button) throw new Error(`Botão ${index} não encontrado na linha "${text}"`)

  return button
}

// Lê o corpo enviado ao servidor como JSON
export async function readJson(request: Request): Promise<JsonValue> {
  return JSON.parse(await request.text())
}

// Primeiro item de uma lista de dados de exemplo (falha se vier vazia)
export function first<T>(items: T[]): T {
  const item = items[0]

  if (!item) throw new Error('Lista de exemplo vazia')

  return item
}
