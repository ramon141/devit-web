import { z } from 'zod'
import type { TFunction } from 'i18next'
import {
  CalendarEventType,
  CalendarEventConfirmationStatus,
  CalendarEventReminder,
  CalendarEventRecurrence,
} from '@/api/generated/models'

export function getEventTypeOptions(t: TFunction) {
  return [
    { value: CalendarEventType.acquisition, label: t('agenda:eventTypeOptions.acquisition') },
    { value: CalendarEventType.appointment, label: t('agenda:eventTypeOptions.appointment') },
    {
      value: CalendarEventType.generic_appointment,
      label: t('agenda:eventTypeOptions.genericAppointment'),
    },
    {
      value: CalendarEventType.sale_preliminary,
      label: t('agenda:eventTypeOptions.salePreliminary'),
    },
    {
      value: CalendarEventType.property_viewing,
      label: t('agenda:eventTypeOptions.propertyViewing'),
    },
    { value: CalendarEventType.call_scheduled, label: t('agenda:eventTypeOptions.callScheduled') },
    { value: CalendarEventType.call_completed, label: t('agenda:eventTypeOptions.callCompleted') },
    { value: CalendarEventType.rental_proposal, label: t('agenda:eventTypeOptions.rentalProposal') },
    {
      value: CalendarEventType.purchase_proposal,
      label: t('agenda:eventTypeOptions.purchaseProposal'),
    },
  ]
}

export function getConfirmationStatusOptions(t: TFunction) {
  return [
    { value: CalendarEventConfirmationStatus.pending, label: t('agenda:confirmationStatusOptions.pending') },
    {
      value: CalendarEventConfirmationStatus.confirmed,
      label: t('agenda:confirmationStatusOptions.confirmed'),
    },
    {
      value: CalendarEventConfirmationStatus.cancelled,
      label: t('agenda:confirmationStatusOptions.cancelled'),
    },
  ]
}

export function getRecurrenceOptions(t: TFunction) {
  return [
    { value: CalendarEventRecurrence.none, label: t('agenda:recurrenceOptions.none') },
    { value: CalendarEventRecurrence.daily, label: t('agenda:recurrenceOptions.daily') },
    { value: CalendarEventRecurrence.weekly, label: t('agenda:recurrenceOptions.weekly') },
    { value: CalendarEventRecurrence.monthly, label: t('agenda:recurrenceOptions.monthly') },
  ]
}

export function getBackgroundColorOptions(t: TFunction) {
  return [
    { value: '#2563eb', label: t('agenda:backgroundColorOptions.blue') },
    { value: '#16a34a', label: t('agenda:backgroundColorOptions.green') },
    { value: '#dc2626', label: t('agenda:backgroundColorOptions.red') },
    { value: '#d97706', label: t('agenda:backgroundColorOptions.orange') },
    { value: '#7c3aed', label: t('agenda:backgroundColorOptions.purple') },
    { value: '#0891b2', label: t('agenda:backgroundColorOptions.cyan') },
  ]
}

export function getReminderOptions(t: TFunction) {
  return [
    { value: CalendarEventReminder.none, label: t('agenda:reminderOptions.none') },
    { value: CalendarEventReminder.at_time, label: t('agenda:reminderOptions.atTime') },
    { value: CalendarEventReminder['5_minutes_before'], label: t('agenda:reminderOptions.5min') },
    { value: CalendarEventReminder['15_minutes_before'], label: t('agenda:reminderOptions.15min') },
    { value: CalendarEventReminder['30_minutes_before'], label: t('agenda:reminderOptions.30min') },
    { value: CalendarEventReminder['1_hour_before'], label: t('agenda:reminderOptions.1hour') },
    { value: CalendarEventReminder['1_day_before'], label: t('agenda:reminderOptions.1day') },
  ]
}

export function createCalendarEventSchema(t: TFunction) {
  return z.object({
    title: z.string().min(2, t('agenda:schema.titleMin')),
    type: z.enum(CalendarEventType, { error: t('agenda:schema.typeRequired') }),
    startDate: z.string().min(1, t('agenda:schema.startDateRequired')),
    startTime: z.string().min(1, t('agenda:schema.startTimeRequired')),
    endTime: z.string().min(1, t('agenda:schema.endTimeRequired')),
    allDay: z.boolean(),
    leadId: z.string().optional(),
    ownerId: z.string().optional(),
    place: z.string().optional(),
    confirmationStatus: z.enum(CalendarEventConfirmationStatus, {
      error: t('agenda:schema.confirmationStatusRequired'),
    }),
    reminder: z.enum(CalendarEventReminder, { error: t('agenda:schema.reminderRequired') }),
    recurrence: z.enum(CalendarEventRecurrence, { error: t('agenda:schema.recurrenceRequired') }),
    keysLocation: z.string().optional(),
    backgroundColor: z.string().optional(),
    private: z.boolean(),
    description: z.string().optional(),
  })
}

export type CalendarEventFormValues = z.infer<ReturnType<typeof createCalendarEventSchema>>
