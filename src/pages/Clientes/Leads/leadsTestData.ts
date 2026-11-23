import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { LeadStatus, LeadWithRelations } from '@/api/generated/models'

// Cria uma solicitação mínima para os testes da tela de solicitações
export function makeLead(
  id: string,
  status: NonNullable<LeadStatus>,
  overrides: Partial<LeadWithRelations> = {},
): LeadWithRelations {
  return {
    id,
    name: `Lead ${id}`,
    status,
    createdAt: '2030-01-01T00:00:00Z',
    updatedAt: '2030-01-01T00:00:00Z',
    ...overrides,
  }
}

// Evento de soltar do dnd-kit: cartão `activeId` solto sobre `overId` (ou fora de tudo)
export function makeDragEnd(activeId: string, overId: string | null): DragEndEvent {
  const event = { active: { id: activeId }, over: overId ? { id: overId } : null }

  return event as DragEndEvent
}

// Evento de início do arrasto do dnd-kit
export function makeDragStart(activeId: string): DragStartEvent {
  return { active: { id: activeId } } as DragStartEvent
}
