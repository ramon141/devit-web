import type { ReactElement } from 'react'
import i18n from '@/i18n'
import ToastViewport from '@/components/ToastViewport'
import { renderWithProviders } from '@/test'
import { createPersonSchema } from '@/pages/Clientes/schemas/personSchema'
import type { PersonFormValues } from '@/pages/Clientes/schemas/personSchema'
import { emptyPersonValues } from '@/pages/Clientes/hooks/usePersonForm'

export const tClientes = i18n.getFixedT('it', 'clientes')

export const validPerson: PersonFormValues = {
  ...emptyPersonValues,
  name: 'Mario Rossi',
  role: 'owner',
}

// Valida os valores no schema e devolve o aviso de cada campo com erro
// overrides aceita texto livre para poder simular valores inválidos (ex.: papel vazio)
export function schemaErrors(overrides: Partial<Record<keyof PersonFormValues, string | boolean>>) {
  const result = createPersonSchema(tClientes).safeParse({ ...validPerson, ...overrides })
  const errors: Record<string, string> = {}

  if (result.success) return errors

  for (const issue of result.error.issues) {
    errors[String(issue.path[0])] = issue.message
  }

  return errors
}

// Renderiza a tela junto com a área de avisos (toasts)
export function renderWithToasts(ui: ReactElement, initialEntries?: string[]) {
  return renderWithProviders(
    <>
      {ui}
      <ToastViewport />
    </>,
    { initialEntries },
  )
}
