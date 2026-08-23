import { z } from 'zod'
import { CalendarEventType, CalendarEventConfirmationStatus, CalendarEventReminder } from '@/api/generated/models'

export const eventTypeOptions = [
  { value: CalendarEventType.acquisition, label: 'Acquisizione' },
  { value: CalendarEventType.appointment, label: 'Nomina' },
  { value: CalendarEventType.generic_appointment, label: 'Appuntamento generico' },
  { value: CalendarEventType.sale_preliminary, label: 'Preliminare di vendita' },
  { value: CalendarEventType.property_viewing, label: 'Visita immobile' },
  { value: CalendarEventType.call_scheduled, label: 'Chiamata da fare' },
  { value: CalendarEventType.call_completed, label: 'Chiamata effettuata' },
  { value: CalendarEventType.rental_proposal, label: 'Proposta di affitto' },
  { value: CalendarEventType.purchase_proposal, label: 'Proposta di acquisto' },
]

export const confirmationStatusOptions = [
  { value: CalendarEventConfirmationStatus.pending, label: 'In attesa' },
  { value: CalendarEventConfirmationStatus.confirmed, label: 'Confermato' },
  { value: CalendarEventConfirmationStatus.cancelled, label: 'Annullato' },
]

export const reminderOptions = [
  { value: CalendarEventReminder.none, label: 'Nessuno' },
  { value: CalendarEventReminder.at_time, label: 'Al momento' },
  { value: CalendarEventReminder['5_minutes_before'], label: '5 minuti prima' },
  { value: CalendarEventReminder['15_minutes_before'], label: '15 minuti prima' },
  { value: CalendarEventReminder['30_minutes_before'], label: '30 minuti prima' },
  { value: CalendarEventReminder['1_hour_before'], label: '1 ora prima' },
  { value: CalendarEventReminder['1_day_before'], label: '1 giorno prima' },
]

export const calendarEventSchema = z.object({
  title: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  type: z.enum(CalendarEventType, { error: 'Seleziona un tipo' }),
  startDate: z.string().min(1, 'Inserisci la data'),
  startTime: z.string().min(1, 'Inserisci l’ora di inizio'),
  endTime: z.string().min(1, 'Inserisci l’ora di fine'),
  place: z.string().optional(),
  confirmationStatus: z.enum(CalendarEventConfirmationStatus, { error: 'Seleziona uno stato' }),
  reminder: z.enum(CalendarEventReminder, { error: 'Seleziona un promemoria' }),
  private: z.boolean(),
  description: z.string().optional(),
})

export type CalendarEventFormValues = z.infer<typeof calendarEventSchema>
