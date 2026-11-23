import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import {
  createCalendarEventSchema,
  type CalendarEventFormValues,
} from '@/pages/Agenda/schemas/calendarEventSchema'

const schema = createCalendarEventSchema(i18n.t)

const validEvent: CalendarEventFormValues = {
  title: 'Visita immobile',
  type: 'property_viewing',
  startDate: '2026-05-10',
  startTime: '10:00',
  endTime: '11:00',
  allDay: false,
  confirmationStatus: 'pending',
  reminder: 'none',
  recurrence: 'none',
  private: false,
}

function issuesOf(values: Partial<Record<keyof CalendarEventFormValues, string | boolean | undefined>>) {
  const result = schema.safeParse({ ...validEvent, ...values })

  if (result.success) return {}

  return Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))
}

describe('Agenda: regras do formulário de evento', () => {
  it('T193 – título vazio e com 1 letra são recusados; com 2 letras é aceito', () => {
    expect(issuesOf({ title: '' }).title).toBe('Inserisci almeno 2 caratteri')
    expect(issuesOf({ title: 'A' }).title).toBe('Inserisci almeno 2 caratteri')
    expect(issuesOf({ title: 'Ab' })).toEqual({})
  })

  it('T194 – evento sem tipo é recusado', () => {
    expect(issuesOf({ type: undefined }).type).toBe('Seleziona un tipo')
    expect(issuesOf({ type: '' }).type).toBe('Seleziona un tipo')
  })

  it('T195 – hora de fim antes da de início dá erro no campo hora de fim', () => {
    const issues = issuesOf({ startTime: '15:00', endTime: '14:00' })

    expect(issues).toEqual({ endTime: 'L’ora di fine deve essere successiva all’ora di inizio' })
  })

  it('T196 – hora de fim igual à de início é recusada', () => {
    const issues = issuesOf({ startTime: '15:00', endTime: '15:00' })

    expect(issues.endTime).toBe('L’ora di fine deve essere successiva all’ora di inizio')
  })

  it('T197 – dia inteiro não verifica horas (15:00 → 14:00 é aceito)', () => {
    expect(issuesOf({ allDay: true, startTime: '15:00', endTime: '14:00' })).toEqual({})
  })

  it('T198 – 23:30 às 00:30 (atravessa a meia-noite) é recusado', () => {
    const issues = issuesOf({ startTime: '23:30', endTime: '00:30' })

    expect(issues.endTime).toBe('L’ora di fine deve essere successiva all’ora di inizio')
  })

  it('T195/T196 – limite: 1 minuto depois do início é aceito', () => {
    expect(issuesOf({ startTime: '15:00', endTime: '15:01' })).toEqual({})
  })

  it('T214 – sem situação de confirmação, lembrete e repetição: 3 avisos, um em cada campo', () => {
    const issues = issuesOf({
      confirmationStatus: undefined,
      reminder: undefined,
      recurrence: undefined,
    })

    expect(issues).toEqual({
      confirmationStatus: 'Seleziona uno stato',
      reminder: 'Seleziona un promemoria',
      recurrence: 'Seleziona una ricorrenza',
    })
  })
})
