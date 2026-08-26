import { useState } from 'react'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
  getCalendarEventParticipantControllerFindQueryKey,
  useCalendarEventParticipantControllerCreate,
  useCalendarEventParticipantControllerDeleteById,
  useCalendarEventParticipantControllerFind,
} from '@/api/generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useCalendarEventParticipants(calendarEventId: string) {
  const { t } = useTranslation('agenda')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [personId, setPersonId] = useState('')

  const { data: participants } = useCalendarEventParticipantControllerFind({
    filter: { where: { calendarEventId }, include: [{ relation: 'person' }] },
  })
  const { mutateAsync: create } = useCalendarEventParticipantControllerCreate()
  const { mutateAsync: remove } = useCalendarEventParticipantControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getCalendarEventParticipantControllerFindQueryKey() })
  }

  function addParticipant() {
    if (!personId) return

    const promise = create({ data: { calendarEventId, personId } })

    toastPromise(promise, {
      pending: t('agenda:toasts.participants.adding'),
      success: () => {
        invalidate()
        setPersonId('')
        return t('agenda:toasts.participants.addSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.participants.addError')),
    })
  }

  function removeParticipant(id: string) {
    toastPromise(remove({ id }), {
      pending: t('agenda:toasts.participants.removing'),
      success: () => {
        invalidate()
        return t('agenda:toasts.participants.removeSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.participants.removeError')),
    })
  }

  return {
    participants: participants ?? [],
    personId,
    setPersonId,
    addParticipant,
    removeParticipant,
  }
}
