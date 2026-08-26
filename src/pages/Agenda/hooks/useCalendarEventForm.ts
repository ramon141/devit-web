import { useEffect } from 'react'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCalendarEventControllerFindQueryKey,
  useCalendarEventControllerCreate,
  useCalendarEventControllerUpdateById,
} from '@/api/generated/api'
import type { CalendarEvent } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import {
  calendarEventSchema,
  type CalendarEventFormValues,
} from '@/pages/Agenda/schemas/calendarEventSchema'

function emptyValues(defaultDate?: string): CalendarEventFormValues {
  return {
    title: '',
    type: 'generic_appointment',
    startDate: defaultDate ?? dayjs().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '10:00',
    place: '',
    confirmationStatus: 'pending',
    reminder: 'none',
    recurrence: 'none',
    keysLocation: '',
    backgroundColor: '',
    private: false,
    description: '',
  }
}

function eventToFormValues(event: CalendarEvent): CalendarEventFormValues {
  return {
    title: event.title,
    type: event.type,
    startDate: dayjs(event.startAt).format('YYYY-MM-DD'),
    startTime: dayjs(event.startAt).format('HH:mm'),
    endTime: dayjs(event.endAt).format('HH:mm'),
    place: event.place ?? '',
    confirmationStatus: event.confirmationStatus ?? 'pending',
    reminder: event.reminder ?? 'none',
    recurrence: event.recurrence ?? 'none',
    keysLocation: event.keysLocation ?? '',
    backgroundColor: event.backgroundColor ?? '',
    private: event.private ?? false,
    description: event.description ?? '',
  }
}

type UseCalendarEventFormProps = {
  event?: CalendarEvent | null
  defaultDate?: string
  onSaved: () => void
}

export function useCalendarEventForm({ event, defaultDate, onSaved }: UseCalendarEventFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useCalendarEventControllerCreate()
  const { mutateAsync: update, isPending: updating } = useCalendarEventControllerUpdateById()

  const form = useForm<CalendarEventFormValues>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: emptyValues(defaultDate),
  })

  useEffect(() => {
    form.reset(event ? eventToFormValues(event) : emptyValues(defaultDate))
  }, [event, defaultDate, form])

  function onSubmit(values: CalendarEventFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      title: values.title,
      type: values.type,
      confirmationStatus: values.confirmationStatus,
      reminder: values.reminder,
      recurrence: values.recurrence,
      private: values.private,
      place: cleaned.place,
      description: cleaned.description,
      keysLocation: cleaned.keysLocation,
      backgroundColor: cleaned.backgroundColor,
      startAt: dayjs(`${values.startDate}T${values.startTime}`).toISOString(),
      endAt: dayjs(`${values.startDate}T${values.endTime}`).toISOString(),
    }

    const promise = event?.id ? update({ id: event.id, data }) : create({ data })

    toastPromise(promise, {
      pending: event ? 'Salvataggio impegno...' : 'Creazione impegno...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getCalendarEventControllerFindQueryKey() })
        onSaved()
        return event ? 'Impegno aggiornato con successo!' : 'Impegno creato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio dell’impegno'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
