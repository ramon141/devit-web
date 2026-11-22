import type { TFunction } from 'i18next'

const RECEPTION_PREFIX = 'reception:'
const RECEPTIONS = ['naples', 'portici'] as const

type Reception = (typeof RECEPTIONS)[number]

// Responsável pode ser um corretor (id) ou uma recepção ("reception:naples")
export function getReceptionOptions(t: TFunction<'clientes'>) {
  return RECEPTIONS.map((reception) => ({
    value: `${RECEPTION_PREFIX}${reception}`,
    label: t(`leadReceptionOptions.${reception}`),
  }))
}

export function assigneeToFormValue(assignedToId?: string | null, assignedReception?: Reception | null) {
  if (assignedReception) return `${RECEPTION_PREFIX}${assignedReception}`

  return assignedToId ?? ''
}

export function assigneeToPayload(value?: string) {
  const isReception = !!value?.startsWith(RECEPTION_PREFIX)

  return {
    assignedToId: isReception ? null : value || null,
    assignedReception: isReception ? (value?.slice(RECEPTION_PREFIX.length) as Reception) : null,
  }
}
