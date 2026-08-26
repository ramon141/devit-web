import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPropertyOwnerControllerFindQueryKey,
  usePropertyControllerUpdateById,
  usePropertyOwnerControllerDeleteById,
  usePropertyOwnerControllerFind,
} from '@/api/generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export function usePropertyOwners(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [personId, setPersonId] = useState('')
  const [percent, setPercent] = useState('')

  const { data: owners } = usePropertyOwnerControllerFind({
    filter: { where: { propertyId }, include: [{ relation: 'person' }] },
  })
  const { mutateAsync: updateProperty } = usePropertyControllerUpdateById()
  const { mutateAsync: remove } = usePropertyOwnerControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyOwnerControllerFindQueryKey() })
  }

  function addOwner() {
    if (!personId) return

    const promise = updateProperty({
      id: propertyId,
      data: { owners: [{ personId, ownershipPercent: toNumberOrNull(percent) }] },
    })

    toastPromise(promise, {
      pending: t('toasts.owners.addPending'),
      success: () => {
        invalidate()
        setPersonId('')
        setPercent('')
        return t('toasts.owners.addSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.owners.addError')),
    })
  }

  function removeOwner(id: string) {
    toastPromise(remove({ id }), {
      pending: t('toasts.owners.removePending'),
      success: () => {
        invalidate()
        return t('toasts.owners.removeSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.owners.removeError')),
    })
  }

  return {
    owners: owners ?? [],
    personId,
    setPersonId,
    percent,
    setPercent,
    addOwner,
    removeOwner,
  }
}
