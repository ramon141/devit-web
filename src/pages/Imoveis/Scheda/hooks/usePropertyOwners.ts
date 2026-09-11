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
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { usePropertyDraft } from '@/pages/Imoveis/contexts/PropertyDraftContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export function usePropertyOwners(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { draft, setDraftBlock } = usePropertyDraft()
  const [personId, setPersonId] = useState('')
  const [percent, setPercent] = useState('')

  const { data: owners } = usePropertyOwnerControllerFind(
    { filter: { where: { propertyId }, include: [{ relation: 'person' }] } },
    { query: { enabled: !!propertyId } }
  )

  const draftOwners = draft.owners.map((owner, index) => ({
    ...owner,
    id: String(index),
    person: undefined,
  }))
  const { mutateAsync: updateProperty } = usePropertyControllerUpdateById()
  const { mutateAsync: remove } = usePropertyOwnerControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyOwnerControllerFindQueryKey() })
  }

  function addOwner() {
    if (!personId) return

    const owner = { personId, ownershipPercent: toNumberOrNull(percent) }

    const promise = propertyId
      ? updateProperty({ id: propertyId, data: { owners: [owner] } })
      : Promise.resolve(setDraftBlock('owners', [...draft.owners, owner]))

    promisePopup(promise, {
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
    const promise = propertyId
      ? remove({ id })
      : Promise.resolve(setDraftBlock('owners', draft.owners.filter((_, index) => String(index) !== id)))

    promisePopup(promise, {
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
    owners: propertyId ? (owners ?? []) : draftOwners,
    personId,
    setPersonId,
    percent,
    setPercent,
    addOwner,
    removeOwner,
  }
}
