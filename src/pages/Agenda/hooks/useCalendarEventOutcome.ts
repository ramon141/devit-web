import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCalendarEventOutcomeControllerFindQueryKey,
  useCalendarEventOutcomeControllerCreate,
  useCalendarEventOutcomeControllerFind,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useCalendarEventOutcome(calendarEventId: string) {
  const { t } = useTranslation('agenda')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [outcome, setOutcome] = useState('')

  const { data: outcomes } = useCalendarEventOutcomeControllerFind({
    filter: { where: { calendarEventId }, order: ['createdAt DESC'] },
  })
  const { mutateAsync: create, isPending } = useCalendarEventOutcomeControllerCreate()

  function saveOutcome() {
    if (!outcome.trim()) return

    const promise = create({ data: { calendarEventId, outcome } })

    toastPromise(promise, {
      pending: t('agenda:toasts.outcome.saving'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getCalendarEventOutcomeControllerFindQueryKey() })
        setOutcome('')
        return t('agenda:toasts.outcome.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.outcome.error')),
    })
  }

  return {
    outcomes: outcomes ?? [],
    outcome,
    setOutcome,
    saveOutcome,
    isSaving: isPending,
  }
}
