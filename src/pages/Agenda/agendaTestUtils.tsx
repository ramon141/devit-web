import dayjs from 'dayjs'
import type { ReactElement } from 'react'
import type { CalendarEventWithRelations } from '@/api/generated/models'
import ToastViewport from '@/components/ToastViewport'
import { renderWithProviders } from '@/test'

// Dia 15 do mês atual: sempre visível na visão mensal inicial
export const EVENT_DAY = dayjs().startOf('month').add(14, 'day').format('YYYY-MM-DD')

type EventOverrides = Partial<CalendarEventWithRelations>

export function buildEvent(overrides: EventOverrides = {}): CalendarEventWithRelations {
  return {
    id: 'ev-1',
    title: 'Visita Rossi',
    type: 'property_viewing',
    startAt: dayjs(`${EVENT_DAY}T10:00`).toISOString(),
    endAt: dayjs(`${EVENT_DAY}T11:00`).toISOString(),
    allDay: false,
    confirmationStatus: 'pending',
    reminder: 'none',
    recurrence: 'none',
    private: false,
    createdById: 'u1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

// O ToastProvider não desenha os avisos: o viewport precisa ser renderizado junto
export function renderWithToasts(ui: ReactElement) {
  return renderWithProviders(
    <>
      {ui}
      <ToastViewport />
    </>,
  )
}
