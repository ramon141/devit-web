import { useState } from 'react'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
  getCalendarEventPropertyControllerFindQueryKey,
  useCalendarEventPropertyControllerCreate,
  useCalendarEventPropertyControllerDeleteById,
  useCalendarEventPropertyControllerFind,
} from '@/api/generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useCalendarEventProperties(calendarEventId: string) {
  const { t } = useTranslation('agenda')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [propertyId, setPropertyId] = useState('')

  const { data: links } = useCalendarEventPropertyControllerFind({
    filter: { where: { calendarEventId }, include: [{ relation: 'property' }] },
  })
  const { mutateAsync: create } = useCalendarEventPropertyControllerCreate()
  const { mutateAsync: remove } = useCalendarEventPropertyControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getCalendarEventPropertyControllerFindQueryKey() })
  }

  function addProperty() {
    if (!propertyId) return

    const promise = create({ data: { calendarEventId, propertyId } })

    toastPromise(promise, {
      pending: t('agenda:toasts.properties.adding'),
      success: () => {
        invalidate()
        setPropertyId('')
        return t('agenda:toasts.properties.addSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.properties.addError')),
    })
  }

  function removeProperty(id: string) {
    toastPromise(remove({ id }), {
      pending: t('agenda:toasts.properties.removing'),
      success: () => {
        invalidate()
        return t('agenda:toasts.properties.removeSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.properties.removeError')),
    })
  }

  return {
    links: links ?? [],
    propertyId,
    setPropertyId,
    addProperty,
    removeProperty,
  }
}
