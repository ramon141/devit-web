import { useState } from 'react'
import type { AxiosError } from 'axios'
import {
  getPropertyOwnerControllerFindQueryKey,
  usePropertyOwnerControllerCreate,
  usePropertyOwnerControllerDeleteById,
  usePropertyOwnerControllerFind,
} from '@/api/generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export function usePropertyOwners(propertyId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [personId, setPersonId] = useState('')
  const [percent, setPercent] = useState('')

  const { data: owners } = usePropertyOwnerControllerFind({
    filter: { where: { propertyId }, include: [{ relation: 'person' }] },
  })
  const { mutateAsync: create } = usePropertyOwnerControllerCreate()
  const { mutateAsync: remove } = usePropertyOwnerControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyOwnerControllerFindQueryKey() })
  }

  function addOwner() {
    if (!personId) return

    const promise = create({
      data: { propertyId, personId, ownershipPercent: toNumberOrNull(percent) },
    })

    toastPromise(promise, {
      pending: 'Aggiunta proprietario...',
      success: () => {
        invalidate()
        setPersonId('')
        setPercent('')
        return 'Proprietario aggiunto con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’aggiunta del proprietario'),
    })
  }

  function removeOwner(id: string) {
    toastPromise(remove({ id }), {
      pending: 'Rimozione proprietario...',
      success: () => {
        invalidate()
        return 'Proprietario rimosso con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la rimozione del proprietario'),
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
