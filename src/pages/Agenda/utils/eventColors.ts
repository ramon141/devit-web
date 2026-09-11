import type { CalendarEventWithRelations } from '@/api/generated/models'

const userColors = [
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#d97706',
  '#7c3aed',
  '#0891b2',
  '#db2777',
  '#65a30d',
  '#4f46e5',
  '#0d9488',
]

const confirmationColors: Record<string, string> = {
  pending: '#9ca3af',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
}

// ponytail: hash do id → cor fixa por usuário; colisões possíveis com >10 usuários
export function getUserColor(userId: string | null | undefined) {
  if (!userId) return 'var(--muted-foreground)'

  let hash = 0
  for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0

  return userColors[hash % userColors.length]
}

export function getEventColor(event: CalendarEventWithRelations) {
  return event.backgroundColor || confirmationColors[event.confirmationStatus ?? 'pending']
}
